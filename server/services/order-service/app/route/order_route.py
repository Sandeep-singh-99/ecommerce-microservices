from fastapi import APIRouter, Depends, Request
from app.db.database import get_db
from app.model.order import Order, OrderItem
