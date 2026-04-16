from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.database import base


class Product(base):
    __tablename__ = 'products'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    product_name = Column(String, unique=True, index=True, nullable=False)
    product_brand = Column(String, nullable=False)
    product_price = Column(Float, nullable=False)
    sales_price = Column(Float, nullable=False)
    product_description = Column(String, nullable=True)
    product_category = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())
    
    # Relationship to multiple product images
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")


class ProductImage(base):
    __tablename__ = 'product_images'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    product_id = Column(String, ForeignKey('products.id'), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    public_id = Column(String, nullable=False)
    is_primary = Column(String, default=lambda: 'false')  
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    
    # Relationship back to product
    product = relationship("Product", back_populates="images")

