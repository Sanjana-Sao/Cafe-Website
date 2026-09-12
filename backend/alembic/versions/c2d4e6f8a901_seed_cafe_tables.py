"""Seed café table numbers.

Revision ID: c2d4e6f8a901
Revises: 87af3e1de8f3
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c2d4e6f8a901"
down_revision: Union[str, Sequence[str], None] = "87af3e1de8f3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    table = sa.table(
        "cafe_tables",
        sa.column("table_number", sa.Integer()),
    )
    op.bulk_insert(table, [{"table_number": number} for number in range(1, 51)])


def downgrade() -> None:
    op.execute(
        sa.text(
            "DELETE FROM cafe_tables "
            "WHERE table_number BETWEEN 1 AND 50 "
            "AND NOT EXISTS ("
            "  SELECT 1 FROM orders WHERE orders.table_number = cafe_tables.table_number"
            ")"
        )
    )
