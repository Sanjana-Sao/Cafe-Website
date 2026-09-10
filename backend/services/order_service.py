from typing import Optional
from ..schema.schemas import OrderIn, OrderOut, OrderItemOut
from ..utils.helpers import IdGenerator
import datetime


class OrderService:
    """Simple in-memory order service. All functions are methods inside this class.
    """

    def __init__(self):
        self._orders = {}

    def create_order(self, payload: OrderIn) -> Optional[OrderOut]:
        order_id = IdGenerator.next_id()
        total = sum(i.price * i.quantity for i in payload.items)
        out_items = [OrderItemOut(**i.dict()) for i in payload.items]
        order = OrderOut(id=order_id, table=payload.table, items=out_items, total=total, created_at=datetime.datetime.utcnow())
        self._orders[order_id] = order
        return order

    def get_order(self, order_id: str) -> Optional[OrderOut]:
        return self._orders.get(order_id)
