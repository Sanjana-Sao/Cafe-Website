import json
import uuid
import datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import CafeTable, Order
from schema.schemas import OrderIn, OrderOut, PaymentListOut


class OrderService:
    """Create orders and persist their queue, status, payment, and description."""

    async def create_order(self, payload: OrderIn, db: AsyncSession) -> OrderOut:
        table_result = await db.execute(
            select(CafeTable).where(CafeTable.table_number == payload.table)
        )
        if table_result.scalar_one_or_none() is None:
            raise ValueError(f"Table {payload.table} does not exist")

        amount = sum(
            (Decimal(str(item.price)) * item.quantity for item in payload.items),
            Decimal("0"),
        )
        description = payload.description or json.dumps(
            [
                {
                    "id": item.id,
                    "name": item.name,
                    "quantity": item.quantity,
                    "price": item.price,
                }
                for item in payload.items
            ]
        )
        order = Order(
            table_number=payload.table,
            order_payment_amount=amount,
            order_description=description,
        )
        db.add(order)
        await db.commit()
        await db.refresh(order)

        return self._to_order_out(order)

    @staticmethod
    def _to_order_out(order: Order) -> OrderOut:
        return OrderOut(
            order_id=str(order.order_id),
            table_number=order.table_number,
            order_status=order.order_status,
            order_queue=order.order_queue,
            order_payment=order.order_payment,
            order_payment_amount=float(order.order_payment_amount),
            order_description=order.order_description,
            created_at=order.created_at,
            updated_at=order.updated_at,
        )

    async def get_order(self, order_id: str, db: AsyncSession) -> OrderOut | None:
        result = await db.execute(
            select(Order).where(Order.order_id == uuid.UUID(order_id))
        )
        order = result.scalar_one_or_none()
        if order is None:
            return None

        return self._to_order_out(order)

    async def list_pending_orders(self, db: AsyncSession) -> list[OrderOut]:
        result = await db.execute(
            select(Order)
            .where(Order.order_status == "not_approve")
            .order_by(Order.order_id.desc())
        )
        return [self._to_order_out(order) for order in result.scalars().all()]

    async def approve_order(self, order_id: str, db: AsyncSession) -> OrderOut | None:
        result = await db.execute(
            select(Order).where(Order.order_id == uuid.UUID(order_id))
        )
        order = result.scalar_one_or_none()
        if order is None:
            return None

        order.order_status = "approved"
        order.order_queue = "preparing"
        order.updated_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()
        await db.refresh(order)
        return await self.get_order(order_id, db)

    async def list_queue_orders(self, db: AsyncSession) -> list[OrderOut]:
        result = await db.execute(
            select(Order)
            .where(
                Order.order_status == "approved",
                Order.order_queue == "preparing",
            )
            .order_by(Order.order_id.desc())
        )
        return [self._to_order_out(order) for order in result.scalars().all()]

    async def serve_order(self, order_id: str, db: AsyncSession) -> OrderOut | None:
        result = await db.execute(
            select(Order).where(Order.order_id == uuid.UUID(order_id))
        )
        order = result.scalar_one_or_none()
        if order is None:
            return None

        order.order_queue = "served"
        order.updated_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()
        await db.refresh(order)
        return await self.get_order(order_id, db)

    async def list_pending_payments(self, db: AsyncSession) -> PaymentListOut:
        result = await db.execute(
            select(Order)
            .where(
                Order.order_status == "approved",
                Order.order_queue == "served",
                Order.order_payment == "pending",
            )
            .order_by(Order.order_id.desc())
        )
        orders = result.scalars().all()
        output = [self._to_order_out(order) for order in orders]
        return PaymentListOut(
            orders=output,
            pending_count=len(output),
            pending_total=float(sum((order.order_payment_amount for order in orders), Decimal("0"))),
        )

    async def mark_order_paid(self, order_id: str, db: AsyncSession) -> OrderOut | None:
        result = await db.execute(
            select(Order).where(Order.order_id == uuid.UUID(order_id))
        )
        order = result.scalar_one_or_none()
        if order is None:
            return None

        order.order_payment = "completed"
        order.updated_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()
        await db.refresh(order)
        return await self.get_order(order_id, db)

    async def list_completed_payments(self, db: AsyncSession) -> PaymentListOut:
        now = datetime.datetime.now(datetime.timezone.utc)
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        result = await db.execute(
            select(Order)
            .where(
                Order.order_payment == "completed",
                Order.updated_at >= start,
            )
            .order_by(Order.updated_at.desc())
        )
        orders = result.scalars().all()
        output = [self._to_order_out(order) for order in orders]
        return PaymentListOut(
            orders=output,
            pending_count=0,
            pending_total=0,
        )
