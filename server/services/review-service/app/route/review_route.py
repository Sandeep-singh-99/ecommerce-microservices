from fastapi import APIRouter, Depends, status, Request, Query, Form, HTTPException, Path, Body
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.db import get_db
from app.schema.review_schema import CreateReview, ReviewResponse, ReviewDelete, ReviewListResponse, ReviewUpdate, ProductRatingResponse, RatingBreakdown
from app.model.review import Comment
from shared.dependencies import get_current_user, TokenData
import httpx

router = APIRouter()

@router.post("/{product_id}", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_rating(
    product_id: str = Path(...),
    review: CreateReview = Body(...), 
    current_user: TokenData = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Check if user already reviewed this product
    existing_review = db.query(Comment).filter(
        Comment.user_id == current_user.id,
        Comment.product_id == product_id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="User already reviewed this product")
    
    new_review = Comment(
        user_id=current_user.id,
        product_id=product_id,
        rating=review.rating,
        comment_text=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    # Map comment_text to comment for the response
    return ReviewResponse(
        id=new_review.id,
        product_id=new_review.product_id,
        user_id=new_review.user_id,
        rating=new_review.rating,
        comment=new_review.comment_text,
        created_at=str(new_review.created_at),
        updated_at=str(new_review.updated_at)
    )

@router.get("/{product_id}/comments", response_model=ReviewListResponse)
async def get_all_comments(
    product_id: str = Path(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    reviews = db.query(Comment).filter(Comment.product_id == product_id).offset(skip).limit(limit).all()
    
    response_reviews = []
    for r in reviews:
        response_reviews.append(ReviewResponse(
            id=r.id,
            product_id=r.product_id,
            user_id=r.user_id,
            rating=r.rating,
            comment=r.comment_text,
            created_at=str(r.created_at),
            updated_at=str(r.updated_at)
        ))
        
    return ReviewListResponse(reviews=response_reviews)

@router.get("/{product_id}/rating", response_model=ProductRatingResponse)
async def get_product_rating(
    product_id: str = Path(...),
    db: Session = Depends(get_db)
):
    reviews = db.query(Comment).filter(Comment.product_id == product_id).all()
    
    total_ratings = len(reviews)
    if total_ratings == 0:
        return ProductRatingResponse(
            product_id=product_id,
            average_rating=0.0,
            total_ratings=0,
            breakdown=[
                RatingBreakdown(stars=5, count=0, percentage=0.0),
                RatingBreakdown(stars=4, count=0, percentage=0.0),
                RatingBreakdown(stars=3, count=0, percentage=0.0),
                RatingBreakdown(stars=2, count=0, percentage=0.0),
                RatingBreakdown(stars=1, count=0, percentage=0.0),
            ]
        )
    
    average_rating = sum(r.rating for r in reviews) / total_ratings
    
    breakdown = []
    for star in range(5, 0, -1):
        count = sum(1 for r in reviews if r.rating == star)
        percentage = (count / total_ratings) * 100 if total_ratings > 0 else 0.0
        breakdown.append(RatingBreakdown(stars=star, count=count, percentage=round(percentage, 2)))
        
    return ProductRatingResponse(
        product_id=product_id,
        average_rating=round(average_rating, 1),
        total_ratings=total_ratings,
        breakdown=breakdown
    )