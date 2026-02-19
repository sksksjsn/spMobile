"""alter_test_table_name_to_nvarchar200

Revision ID: b2c3d4e5f6a1
Revises: a1b2c3d4e5f6
Create Date: 2026-02-19 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b2c3d4e5f6a1"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "test_table",
        "name",
        existing_type=sa.String(length=255),
        type_=sa.Unicode(200),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "test_table",
        "name",
        existing_type=sa.Unicode(200),
        type_=sa.String(length=255),
        existing_nullable=False,
    )
