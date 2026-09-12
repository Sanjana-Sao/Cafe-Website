"""create cafe Tables

Revision ID: 87af3e1de8f3
Revises: 
Create Date: 2026-09-12 16:59:04.573548

"""
from typing import Sequence, Union
from sqlalchemy.dialects import postgresql
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '87af3e1de8f3'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:

    # =========================
    # MENUS
    # =========================

    op.create_table(
        "menus",

        sa.Column(
            "menu_id",
            postgresql.UUID(as_uuid=True),
            nullable=False
        ),

        sa.Column(
            "menu_name",
            sa.String(length=150),
            nullable=False
        ),

        sa.Column(
            "menu_price",
            sa.Numeric(10, 2),
            nullable=False
        ),

        sa.Column(
            "menu_availability",
            sa.Boolean(),
            nullable=False
        ),

        sa.Column(
            "menu_description",
            sa.Text(),
            nullable=True
        ),

        sa.PrimaryKeyConstraint("menu_id")
    )


    # =========================
    # CAFE TABLES
    # =========================

    op.create_table(
        "cafe_tables",

        sa.Column(
            "table_number",
            sa.Integer(),
            nullable=False
        ),

        sa.PrimaryKeyConstraint("table_number")
    )


    # =========================
    # ORDERS
    # =========================

    op.create_table(
        "orders",

        sa.Column(
            "order_id",
            postgresql.UUID(as_uuid=True),
            nullable=False
        ),

        sa.Column(
            "table_number",
            sa.Integer(),
            nullable=False
        ),

        sa.Column(
            "order_status",
            sa.String(length=20),
            nullable=False
        ),

        sa.Column(
            "order_queue",
            sa.String(length=20),
            nullable=False
        ),

        sa.Column(
            "order_payment",
            sa.String(length=20),
            nullable=False
        ),

        sa.Column(
            "order_payment_amount",
            sa.Numeric(10, 2),
            nullable=False
        ),

        sa.Column(
            "order_description",
            sa.Text(),
            nullable=True
        ),

        sa.ForeignKeyConstraint(
            ["table_number"],
            ["cafe_tables.table_number"]
        ),

        sa.PrimaryKeyConstraint("order_id")
    )


def downgrade() -> None:

    op.drop_table("orders")

    op.drop_table("cafe_tables")

    op.drop_table("menus")