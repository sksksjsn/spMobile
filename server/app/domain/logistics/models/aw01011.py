"""
Logistics 도메인 ORM 모델
AW01011 - 반출입 물품목록
"""

from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Numeric, Text, Unicode
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .aw01010 import Aw01010


class Aw01011(Base):
    """반출입 물품목록 (AW01011)

    반출입 문서 라인(물품) 테이블.
    PK: (DOC_NO, ITEM_SEQ)
    """

    __tablename__ = "AW01011"

    # ── 복합 Primary Key ──────────────────────────────────────────────────────
    doc_no: Mapped[str] = mapped_column(
        "DOC_NO",
        Unicode(13),
        ForeignKey("AW01010.DOC_NO", ondelete="CASCADE"),
        primary_key=True,
        comment="반출입번호",
    )
    item_seq: Mapped[int] = mapped_column(
        "ITEM_SEQ", Integer, primary_key=True, comment="순번"
    )

    # ── 물품 정보 ─────────────────────────────────────────────────────────────
    item_name: Mapped[str] = mapped_column(
        "ITEM_NAME", Unicode(100), nullable=False, comment="자재명"
    )
    item_spec: Mapped[Optional[str]] = mapped_column(
        "ITEM_SPEC", Unicode(100), nullable=True, comment="규격"
    )
    unit_code: Mapped[Optional[str]] = mapped_column(
        "UNIT_CODE", Unicode(10), nullable=True, comment="단위코드"
    )
    maker: Mapped[Optional[str]] = mapped_column(
        "MAKER", Unicode(50), nullable=True, comment="메이커"
    )
    quantity: Mapped[Optional[float]] = mapped_column(
        "QUANTITY", Numeric(18, 3), nullable=True, comment="수량"
    )
    reason: Mapped[Optional[str]] = mapped_column(
        "REASON", Unicode(200), nullable=True, comment="반출 사유"
    )
    note: Mapped[Optional[str]] = mapped_column(
        "NOTE", Unicode(500), nullable=True, comment="비고"
    )
    photo_data: Mapped[Optional[str]] = mapped_column(
        "PHOTO_DATA", Text, nullable=True, comment="사진 데이터(JSON)"
    )

    # ── 관계 ──────────────────────────────────────────────────────────────────
    header: Mapped["Aw01010"] = relationship("Aw01010", back_populates="items")

    def __repr__(self) -> str:
        return (
            f"<Aw01011(doc_no='{self.doc_no}', item_seq={self.item_seq}, "
            f"item_name='{self.item_name}')>"
        )
