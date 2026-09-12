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
    description: str | None = None


class SignupIn(BaseModel):
    email: str
    password: str
    role: str


class UserOut(BaseModel):
    user_id: str
    email: str
    role: str
    created_at: datetime.datetime
    updated_at: datetime.datetime


class TokenOut(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class OrderItemOut(BaseModel):
    id: str
    name: str
    price: float
    quantity: int


class OrderOut(BaseModel):
    order_id: str
    table_number: int
    order_status: str
    order_queue: str
    order_payment: str
    order_payment_amount: float
    order_description: str | None = None
    created_at: datetime.datetime
    updated_at: datetime.datetime


class PaymentListOut(BaseModel):
    orders: List[OrderOut]
    pending_count: int
    pending_total: float
