from fastapi import APIRouter, HTTPException, Depends, UploadFile, status, Request, File, Form, Query
from typing import Optional, List
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from fastapi.concurrency import run_in_threadpool
from typing_extensions import Annotated
from app.db.database import get_db
from app.model.product import Product, ProductImage
from shared.cloudinary import upload_image, delete_image
from shared.dependencies import get_current_user, TokenData

router = APIRouter()


@router.post("/create-product", status_code=status.HTTP_201_CREATED)
async def create_product(
    request: Request,
    product_name: str = Form(...),
    product_brand: str = Form(...),
    product_price: float = Form(..., ge=0.0),
    sales_price: float = Form(..., ge=0.0),
    product_description: Optional[str] = Form(None),
    product_details: Optional[str] = Form(None),
    product_category: str = Form(...),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):

    # Role check
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not allowed")

    uploaded_images = []

    try:
        # Create product
        new_product = Product(
            product_name=product_name,
            product_brand=product_brand,
            product_price=product_price,
            sales_price=sales_price,
            product_description=product_description,
            product_details=product_details,
            product_category=product_category
        )

        db.add(new_product)
        db.flush()  # get product.id without commit

        # Upload images
        for index, image in enumerate(images):

            # Validate file type
            if not image.content_type.startswith("image/"):
                raise HTTPException(400, "Only image files allowed")

            # Run blocking upload safely
            result = await run_in_threadpool(upload_image, image.file, image.filename)

            # Expecting: (image_url, public_id)
            if not result:
                raise HTTPException(500, "Image upload failed")

            image_url, public_id = result["secure_url"], result["public_id"]

            uploaded_images.append(public_id)

            db.add(ProductImage(
                product_id=new_product.id,
                image_url=image_url,
                public_id=public_id,
                is_primary=(index == 0)  
            ))

        db.commit()
        db.refresh(new_product)

        return {
            "message": "Product created successfully",
            "product_id": new_product.id
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Product already exists")

    except Exception as e:
        db.rollback()

        for public_id in uploaded_images:
            try:
                delete_image(public_id)
            except:
                pass

        raise HTTPException(500, f"Error: {str(e)}")
    

@router.get("/get-products")
def get_products(
    db: Session = Depends(get_db),

    # Filters
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    search: Optional[str] = Query(None),

    # Pagination
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=100)
):
    query = db.query(Product).options(selectinload(Product.images))

    # Apply filters
    if category:
        query = query.filter(Product.product_category == category)

    if min_price is not None:
        query = query.filter(Product.sales_price >= min_price)

    if max_price is not None:
        query = query.filter(Product.sales_price <= max_price)

    if search:
        query = query.filter(Product.product_name.ilike(f"%{search}%"))

    # Total count (before pagination)
    total = query.count()

    # Pagination logic
    skip = (page - 1) * limit

    products = query.offset(skip).limit(limit).all()

    # Format response
    result = []
    for product in products:
        result.append({
            "id": product.id,
            "name": product.product_name,
            "brand": product.product_brand,
            "price": product.product_price,
            "sales_price": product.sales_price,
            "category": product.product_category,
            "description": product.product_description,
            "images": [
                {
                    "url": img.image_url,
                    "is_primary": img.is_primary
                } for img in product.images
            ],
            "created_at": product.created_at
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "products": result
    }