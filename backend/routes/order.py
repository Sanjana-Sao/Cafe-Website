from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database.session import get_db
from schema.schemas import OrderIn, OrderOut, PaymentListOut
from services.order_service import OrderService
from routes.auth import require_roles

router = APIRouter()


@router.post("/orders", response_model=OrderOut)
async def place_order(
    payload: OrderIn,
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
):
    """Create a pending order and return its database-generated identifier."""
    try:
        return await svc.create_order(payload, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/orders", response_model=list[OrderOut])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("staff", "manager")),
):
    """Return all orders waiting for staff approval."""
    return await svc.list_pending_orders(db)


@router.get("/orders/queue", response_model=list[OrderOut])
async def list_queue_orders(
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("staff", "manager")),
):
    """Return approved orders currently in the kitchen queue."""
    return await svc.list_queue_orders(db)


@router.get("/orders/payments", response_model=PaymentListOut)
async def list_pending_payments(
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("manager")),
):
    """Return served orders waiting for payment."""
    return await svc.list_pending_payments(db)


@router.get("/orders/payments/completed-today", response_model=PaymentListOut)
async def list_completed_payments(
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("manager")),
):
    """Return payments completed today."""
    return await svc.list_completed_payments(db)


@router.post("/orders/{order_id}/approve", response_model=OrderOut)
async def approve_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("staff", "manager")),
):
    """Approve an order and move it into the kitchen queue."""
    try:
        order = await svc.approve_order(order_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid order ID") from exc

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/{order_id}/serve", response_model=OrderOut)
async def serve_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("staff", "manager")),
):
    """Mark an approved order as served and remove it from the active queue."""
    try:
        order = await svc.serve_order(order_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid order ID") from exc

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/{order_id}/pay", response_model=OrderOut)
async def mark_order_paid(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
    _user=Depends(require_roles("manager")),
):
    """Mark a served order's payment as completed."""
    try:
        order = await svc.mark_order_paid(order_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid order ID") from exc

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/orders/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    svc: OrderService = Depends(OrderService),
):
    """Return the current status and payment details for a saved order."""
    try:
        order = await svc.get_order(order_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid order ID") from exc

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
