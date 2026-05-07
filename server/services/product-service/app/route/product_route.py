from fastapi import APIRouter, HTTPException, Depends, UploadFile, status, Request, File, Form, Query
from typing import Optional, List
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from fastapi.concurrency import run_in_threadpool
from app.db.database import get_db
from app.model.product import Product, ProductImage
from shared.cloudinary import delete_image, upload_multiple_images
from shared.dependencies import get_current_user, TokenData
import asyncio

router = APIRouter()

@router.post("/create-product", status_code=status.HTTP_201_CREATED)
async def create_product(
    request: Request,
    product_name: str = Form(...),
    product_brand: str = Form(...),
    product_price: float = Form(..., ge=0.0),
    sales_price: float = Form(..., ge=0.0),
    product_description: str = Form(...),
    product_details: str = Form(...),
    product_category: str = Form(...),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):

    if current_user.role != "ADMIN":
        raise HTTPException(403, "Admin access required")

    uploaded_public_ids = []

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
        db.flush()

        # Validate images first
        for image in images:
            if not image.content_type.startswith("image/"):
                raise HTTPException(400, "Only image files allowed")

        # PARALLEL UPLOADS
        upload_tasks = [
            run_in_threadpool(
                upload_multiple_images,
                image.file,
                "E-Commerce-Microservices/products"
            )
            for image in images
        ]

        results = await asyncio.gather(*upload_tasks, return_exceptions=True)

        # Check for failures
        for res in results:
            if isinstance(res, Exception):
                raise res

        # Save images
        for index, result in enumerate(results):
            image_url = result["secure_url"]
            public_id = result["public_id"]

            uploaded_public_ids.append(public_id)

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

        # CLEANUP uploaded images if failure
        cleanup_tasks = [
            run_in_threadpool(delete_image, pid)
            for pid in uploaded_public_ids
        ]
        await asyncio.gather(*cleanup_tasks, return_exceptions=True)

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
            "details": product.product_details,
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

@router.get("/get-product/{product_id}")
async def get_product_details(
    product_id: str,
    db: Session = Depends(get_db)
):
    product = db.query(Product).options(selectinload(Product.images)).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    return {
        "id": product.id,
        "name": product.product_name,
        "brand": product.product_brand,
        "price": product.product_price,
        "sales_price": product.sales_price,
        "category": product.product_category,
        "description": product.product_description,
        "details": product.product_details,
        "images": [
            {
                "url": img.image_url,
                "is_primary": img.is_primary
            } for img in product.images
        ],
        "created_at": product.created_at
    }


@router.delete("/delete-product/{product_id}")
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(403, "Admin access required")

    product = db.query(Product).options(selectinload(Product.images)).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    # DELETE images from Cloudinary
    delete_tasks = [
        run_in_threadpool(delete_image, img.public_id)
        for img in product.images
    ]
    await asyncio.gather(*delete_tasks, return_exceptions=True)

    # DELETE product from DB
    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


@router.patch("/update-product/{product_id}")
async def update_product(
    product_id: str,
    request: Request,
    product_name: Optional[str] = Form(None),
    product_brand: Optional[str] = Form(None),
    product_price: Optional[float] = Form(None, ge=0.0),
    sales_price: Optional[float] = Form(None, ge=0.0),
    product_description: Optional[str] = Form(None),
    product_details: Optional[str] = Form(None),
    product_category: Optional[str] = Form(None),
    new_images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(403, "Admin access required")

    product = db.query(Product).options(selectinload(Product.images)).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "Product not found")

    # UPDATE fields if provided
    if product_name is not None:
        product.product_name = product_name

    if product_brand is not None:
        product.product_brand = product_brand

    if product_price is not None:
        product.product_price = product_price

    if sales_price is not None:
        product.sales_price = sales_price

    if product_description is not None:
        product.product_description = product_description

    if product_details is not None:
        product.product_details = product_details

    if product_category is not None:
        product.product_category = product_category

    # Handle new images
    if new_images is not None and len(new_images) > 0:
        # Validate new images first
        for image in new_images:
            if not image.content_type.startswith("image/"):
                raise HTTPException(400, "Only image files allowed")

        # UPLOAD new images in parallel
        upload_tasks = [
            run_in_threadpool(
                upload_multiple_images,
                image.file,
                "E-Commerce-Microservices/products"
            )
            for image in new_images
        ]

        results = await asyncio.gather(*upload_tasks, return_exceptions=True)

        # Check for failures
        for res in results:
            if isinstance(res, Exception):
                raise res

        # DELETE old images from Cloudinary
        delete_tasks = [
            run_in_threadpool(delete_image, img.public_id)
            for img in product.images
        ]
        await asyncio.gather(*delete_tasks, return_exceptions=True)

        # ADD new images to the product
        for image in new_images:
            db_image = ProductImage(
                image_url=image.url,
                public_id=image.public_id,
                is_primary=False
            )
            product.images.append(db_image)

    db.commit()
    db.refresh(product)

    return {
        "id": product.id,
        "name": product.product_name,
        "brand": product.product_brand,
        "price": product.product_price,
        "sales_price": product.sales_price,
        "category": product.product_category,
        "description": product.product_description,
        "details": product.product_details,
        "images": [
            {
                "url": img.image_url,
                "is_primary": img.is_primary
            } for img in product.images
        ],
        "created_at": product.created_at
    }


@router.get("/get-featured-products")
def get_featured_products(db: Session = Depends(get_db)):
    # Get up to 8 distinct categories
    categories = db.query(Product.product_category).distinct().limit(8).all()
    
    result = []
    for (category_name,) in categories:
        # Get the first product for this category
        product = db.query(Product).options(selectinload(Product.images)).filter(Product.product_category == category_name).first()
        
        if product:
            result.append({
                "id": product.id,
                "name": product.product_name,
                "price": product.product_price,
                "sales_price": product.sales_price,
                "category": product.product_category,
                "images": [
                    {
                        "url": img.image_url,
                        "is_primary": img.is_primary
                    } for img in product.images
                ]
            })
            
    return {"products": result}


@router.get("/get-related-products/{product_id}")
def get_related_products(product_id: str, db: Session = Depends(get_db)):
    # First get the original product to find its category
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(404, "Product not found")
        
    category_name = product.product_category
    
    # Query up to 6 related products in the same category, excluding the current one
    related_products = db.query(Product).options(selectinload(Product.images))\
        .filter(Product.product_category == category_name, Product.id != product_id)\
        .limit(6).all()
        
    result = []
    for rel_product in related_products:
        result.append({
            "id": rel_product.id,
            "name": rel_product.product_name,
            "price": rel_product.product_price,
            "sales_price": rel_product.sales_price,
            "category": rel_product.product_category,
            "images": [
                {
                    "url": img.image_url,
                    "is_primary": img.is_primary
                } for img in rel_product.images
            ]
        })
        
    return {"products": result}




