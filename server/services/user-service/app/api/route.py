from fastapi import APIRouter, HTTPException, Depends, UploadFile, status, Request, File, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, UserLogout
from app.models.user import User
from app.utils.utils import hash_password, verify_password, create_access_token, decode_access_token
from app.utils.cloudinary import upload_image, delete_image
from app.dependencies.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, response: Response, request: Request, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = hash_password(user.password)

    profile_image_url = None
    profile_image_public_id = None
    if user.profile_picture:
        upload_result = await upload_image(user.profile_picture)
        profile_image_url = upload_result['secure_url']
        profile_image_public_id = upload_result['public_id']

    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        user_name=user.full_name,
        profile_image=profile_image_url,
        profile_image_public_id=profile_image_public_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7
    )

    return new_user

@router.post("/login", response_model=UserResponse)
async def login(user: UserLogin, response: Response, request: Request, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60*24*15,
        secure=True,  # dev
        samesite="none"
    )

    return {"message": "User logged in successfully"}


@router.get("/me", response_model=UserResponse)
def read_users_me(request: Request, current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout", response_model=UserLogout)
def logout(request: Request, response: Response, current_user: User = Depends(get_current_user)):
    response.delete_cookie(
           key="access_token",
           httponly=True,
           secure=True,      
           samesite="none"   
    )
    return current_user