import uuid
import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    DateTime,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from database.session import Base


# =========================
# MENU TABLE
# =========================

class Menu(Base):
    __tablename__ = "menus"

    menu_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    menu_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    menu_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    menu_availability: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    menu_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


# =========================
# CAFE TABLE
# =========================

class CafeTable(Base):
    __tablename__ = "cafe_tables"

    table_number: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )


# =========================
# USER TABLE
# =========================

class User(Base):
    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# =========================
# ORDER TABLE
# =========================

class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    table_number: Mapped[int] = mapped_column(
        ForeignKey("cafe_tables.table_number"),
        nullable=False
    )

    # approve / not_approve
    order_status: Mapped[str] = mapped_column(
        String(20),
        default="not_approve",
        nullable=False
    )

    # preparing / delivered
    order_queue: Mapped[str] = mapped_column(
        String(20),
        default="preparing",
        nullable=False
    )

    # pending / completed
    order_payment: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False
    )

    order_payment_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    order_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )