from fastapi import APIRouter, HTTPException, Depends, UploadFile, status, Request, File, Response, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user_schema import UserLogin, UserResponse, UserLogout
from app.models.user import User
from app.utils.utils import hash_password, verify_password, create_access_token, decode_access_token
from shared.cloudinary import upload_image, delete_image
from shared.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    response: Response, 
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    profile_picture: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = hash_password(password)

    profile_image_url = None
    profile_image_public_id = None
    if profile_picture:
        upload_result = await upload_image(profile_picture)
        profile_image_url = upload_result['secure_url']
        profile_image_public_id = upload_result['public_id']

    new_user = User(
        email=email,
        hashed_password=hashed_password,
        user_name=full_name,
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
async def login(response: Response, request: Request, email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(password, db_user.hashed_password):
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

    return db_user


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