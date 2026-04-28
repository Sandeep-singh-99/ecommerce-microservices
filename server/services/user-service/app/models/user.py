from sqlalchemy import Column, String, Enum
from uuid import uuid4
from datetime import datetime
from app.db.database import Base
import enum

class userRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    email = Column(String, unique=True, index=True, nullable=True)
    user_name = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(userRole), default=userRole.USER, nullable=False)
    profile_image = Column(String, nullable=True)
    profile_image_public_id = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)

    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())