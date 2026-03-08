"""Add AW01010 AW01011 tables

Revision ID: a3c7e9f12b45
Revises: bfd406d17dd4
Create Date: 2026-03-08 12:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a3c7e9f12b45"
down_revision: Union[str, None] = "bfd406d17dd4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Apply migration changes to database."""
    # AW01010 - 반출입 기본정보
    op.create_table(
        "AW01010",
        sa.Column("DOC_NO", sa.Unicode(length=13), nullable=False, comment="반출입번호"),
        sa.Column("BUSI_PLACE", sa.Unicode(length=1), nullable=False, comment="반출 사업장코드"),
        sa.Column("EXPORT_DATE", sa.DateTime(), nullable=True, comment="반출 일자"),
        sa.Column("AUTHOR_NAME", sa.Unicode(length=50), nullable=True, comment="작성 담당자명"),
        sa.Column("AUTHOR_DEPT", sa.Unicode(length=20), nullable=True, comment="작성 담당자 부서코드"),
        sa.Column("AUTHOR_PHONE", sa.Unicode(length=20), nullable=True, comment="작성 담당자 연락처"),
        sa.Column("PARTNER_COMPANY", sa.Unicode(length=100), nullable=True, comment="협력업체"),
        sa.Column("RECEIVER_NAME", sa.Unicode(length=50), nullable=True, comment="협력업체 인수자명"),
        sa.Column("RECEIVER_PHONE", sa.Unicode(length=20), nullable=True, comment="협력업체 인수자 전화번호"),
        sa.Column("TRANSPORT_TYPE", sa.Unicode(length=2), nullable=True, comment="운송 유형 코드"),
        sa.Column("DRIVER_NAME", sa.Unicode(length=50), nullable=True, comment="직납 운전자 성명"),
        sa.Column("DRIVER_PHONE", sa.Unicode(length=20), nullable=True, comment="직납 운전자 연락처"),
        sa.Column("DRIVER_VEHICLE_NO", sa.Unicode(length=20), nullable=True, comment="직납 운전자 차량번호"),
        sa.Column("COURIER_NAME", sa.Unicode(length=50), nullable=True, comment="택배사명"),
        sa.Column("COURIER_INVOICE_NO", sa.Unicode(length=50), nullable=True, comment="송장번호"),
        sa.Column(
            "STATUS",
            sa.Unicode(length=2),
            nullable=False,
            server_default="반출",
            comment="상태(반출/반입)",
        ),
        sa.Column(
            "SECURITY_CHECK_YN",
            sa.String(length=1),
            nullable=False,
            server_default="N",
            comment="경비실 확인 여부",
        ),
        sa.Column(
            "RECEIVER_CHECK_YN",
            sa.String(length=1),
            nullable=False,
            server_default="N",
            comment="인수자 확인 여부",
        ),
        sa.Column("IN_DATE", sa.DateTime(), nullable=True, comment="등록 일자"),
        sa.Column("IN_USER", sa.Unicode(length=50), nullable=True, comment="등록자"),
        sa.Column("UP_DATE", sa.DateTime(), nullable=True, comment="수정 일자"),
        sa.Column("UP_USER", sa.Unicode(length=50), nullable=True, comment="수정자"),
        sa.PrimaryKeyConstraint("DOC_NO", name=op.f("pk_AW01010")),
    )

    # AW01011 - 반출입 물품목록
    op.create_table(
        "AW01011",
        sa.Column("DOC_NO", sa.Unicode(length=13), nullable=False, comment="반출입번호"),
        sa.Column("ITEM_SEQ", sa.Integer(), nullable=False, comment="순번"),
        sa.Column("ITEM_NAME", sa.Unicode(length=100), nullable=False, comment="자재명"),
        sa.Column("ITEM_SPEC", sa.Unicode(length=100), nullable=True, comment="규격"),
        sa.Column("UNIT_CODE", sa.Unicode(length=10), nullable=True, comment="단위코드"),
        sa.Column("MAKER", sa.Unicode(length=50), nullable=True, comment="메이커"),
        sa.Column("QUANTITY", sa.Numeric(precision=18, scale=3), nullable=True, comment="수량"),
        sa.Column("REASON", sa.Unicode(length=200), nullable=True, comment="반출 사유"),
        sa.Column("NOTE", sa.Unicode(length=500), nullable=True, comment="비고"),
        sa.Column("PHOTO_DATA", sa.Text(), nullable=True, comment="사진 데이터(JSON)"),
        sa.ForeignKeyConstraint(
            ["DOC_NO"],
            ["AW01010.DOC_NO"],
            name="fk_AW01011_AW01010",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("DOC_NO", "ITEM_SEQ", name=op.f("pk_AW01011")),
    )

    # 인덱스
    op.create_index("ix_AW01010_busi_place", "AW01010", ["BUSI_PLACE"])
    op.create_index("ix_AW01010_status", "AW01010", ["STATUS"])
    op.create_index("ix_AW01010_export_date", "AW01010", ["EXPORT_DATE"])


def downgrade() -> None:
    """Revert migration changes from database."""
    op.drop_index("ix_AW01010_export_date", table_name="AW01010")
    op.drop_index("ix_AW01010_status", table_name="AW01010")
    op.drop_index("ix_AW01010_busi_place", table_name="AW01010")
    op.drop_table("AW01011")
    op.drop_table("AW01010")
