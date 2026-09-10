from pydantic import BaseModel
from typing import List
import datetime


class MenuItemOut(BaseModel):
    id: str
    name: str
    description: str | None = None
    price: float


class MenuCategoryOut(BaseModel):
    id: str
    name: str
    description: str | None = None
    items: List[MenuItemOut] = []


class OrderItemIn(BaseModel):
    id: str
    name: str
    price: float
    quantity: int


class OrderIn(BaseModel):
    table: int
    items: List[OrderItemIn]


class OrderItemOut(BaseModel):
    id: str
    name: str
    price: float
    quantity: int


class OrderOut(BaseModel):
    id: str
    table: int
    items: List[OrderItemOut]
    total: float
    created_at: datetime.datetime
