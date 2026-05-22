from fastapi import APIRouter, Depends, status, Request, Query, Form, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.schema.review_schema import CreateReview, ReviewResponse, ReviewDelete, ReviewListResponse, ReviewUpdate
from app.model.review import Comment
from shared.dependencies import get_current_user, TokenData
import httpx

router = APIRouter()

@router.post("/{product_id}", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_rating(current_user: TokenData = Depends(get_current_user), review: CreateReview = Depends(), db: Session = Depends(get_db)):
    