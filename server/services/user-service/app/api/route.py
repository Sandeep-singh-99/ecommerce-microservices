from fastapi import APIRouter, HTTPException, Depends, UploadFile, status, Request, File, Response, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.database import get_db
from app.schemas.user_schema import UserResponse, UserCreate, UserLogin, UserLogout
from app.models.user import User
from app.utils.utils import hash_password, verify_password, create_access_token
from shared.cloudinary import upload_image, delete_image
from shared.dependencies import get_current_user, TokenData

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(
    request: Request,
    response: Response,
    user_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # check email
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password
    hashed_password = hash_password(password)

    # upload image
    image_url, image_url_id = None, None
    if image:
        result = await upload_image(image, folder="E-Commerce-Microservices")
        image_url, image_url_id = result["secure_url"], result["public_id"]

    # create user
    db_user = User(
        user_name=user_name,
        email=email,
        hashed_password=hashed_password,
        profile_image=image_url,
        profile_image_public_id=image_url_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # create JWT
    access_token = create_access_token({"sub": db_user.email})

    # set cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60*24*15,
        secure=True,
        samesite="none"
    )
    return db_user


@router.post("/login", response_model=UserResponse)
def login(
    request: Request,
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60*24*15,
        secure=True,  # dev
        samesite="none"
    )

    return db_user


@router.get("/me", response_model=UserResponse)
def read_users_me(request: Request, current_user: TokenData = Depends(get_current_user)):
    return current_user


@router.post("/logout", response_model=UserLogout)
def logout(request: Request, response: Response, current_user: TokenData = Depends(get_current_user)):
    response.delete_cookie(
           key="access_token",
           httponly=True,
           secure=True,      
           samesite="none"   
    )
    return {"message": "Logged out successfully"}
