from fastapi import APIRouter, Depends, HTTPException
from ..schema.schemas import OrderIn, OrderOut
from ..services.order_service import OrderService

router = APIRouter()


@router.post("/orders", response_model=OrderOut)
def place_order(payload: OrderIn, svc: OrderService = Depends(OrderService)):
    """Place an order and return confirmation."""
    order = svc.create_order(payload)
    if not order:
        raise HTTPException(status_code=500, detail="Unable to create order")
    return order
