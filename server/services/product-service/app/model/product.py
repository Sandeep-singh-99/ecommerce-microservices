from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.database import Base


class Product(Base):
    __tablename__ = 'products'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    product_name = Column(String, index=True, nullable=False)
    product_brand = Column(String, nullable=False)
    product_price = Column(Float, nullable=False)
    sales_price = Column(Float, nullable=False)
    product_description = Column(String, nullable=True)
    product_details = Column(String, nullable=True)
    product_category = Column(String, nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    trending_products = relationship(
        "TrendingProduct",
        back_populates="product",
        cascade="all, delete-orphan",
        lazy="selectin"
    )


class ProductImage(Base):
    __tablename__ = 'product_images'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    product_id = Column(String, ForeignKey('products.id'), nullable=False, index=True)

    image_url = Column(String, nullable=False)
    public_id = Column(String, nullable=False)

    is_primary = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="images")


class TrendingProduct(Base):
    __tablename__ = "trending_products"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    product_id = Column(String, ForeignKey('products.id'), nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="trending_products")