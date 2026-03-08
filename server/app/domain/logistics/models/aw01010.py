"""
Logistics 도메인 ORM 모델
AW01010 - 반출입 기본정보
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Numeric, String, Unicode
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base


class Aw01010(Base):
    """반출입 기본정보 (AW01010)

    반출입 문서 헤더 테이블.
    DOC_NO: 사업장코드(1) + 년월일(8) + 시퀀스(4) = 13자리
    """

    __tablename__ = "AW01010"

    # ── Primary Key ──────────────────────────────────────────────────────────
    doc_no: Mapped[str] = mapped_column(
        "DOC_NO", Unicode(13), primary_key=True, comment="반출입번호"
    )

    # ── 기본 정보 ─────────────────────────────────────────────────────────────
    busi_place: Mapped[str] = mapped_column(
        "BUSI_PLACE", Unicode(1), nullable=False, comment="반출 사업장코드"
    )
    export_date: Mapped[Optional[datetime]] = mapped_column(
        "EXPORT_DATE", DateTime, nullable=True, comment="반출 일자"
    )
    author_name: Mapped[Optional[str]] = mapped_column(
        "AUTHOR_NAME", Unicode(50), nullable=True, comment="작성 담당자명"
    )
    author_dept: Mapped[Optional[str]] = mapped_column(
        "AUTHOR_DEPT", Unicode(20), nullable=True, comment="작성 담당자 부서코드"
    )
    author_phone: Mapped[Optional[str]] = mapped_column(
        "AUTHOR_PHONE", Unicode(20), nullable=True, comment="작성 담당자 연락처"
    )

    # ── 협력업체 정보 ────────────────────────────────────────────────────────
    partner_company: Mapped[Optional[str]] = mapped_column(
        "PARTNER_COMPANY", Unicode(100), nullable=True, comment="협력업체"
    )
    receiver_name: Mapped[Optional[str]] = mapped_column(
        "RECEIVER_NAME", Unicode(50), nullable=True, comment="협력업체 인수자명"
    )
    receiver_phone: Mapped[Optional[str]] = mapped_column(
        "RECEIVER_PHONE", Unicode(20), nullable=True, comment="협력업체 인수자 전화번호"
    )

    # ── 운송 정보 ─────────────────────────────────────────────────────────────
    transport_type: Mapped[Optional[str]] = mapped_column(
        "TRANSPORT_TYPE", Unicode(2), nullable=True, comment="운송 유형 코드"
    )
    driver_name: Mapped[Optional[str]] = mapped_column(
        "DRIVER_NAME", Unicode(50), nullable=True, comment="직납 운전자 성명"
    )
    driver_phone: Mapped[Optional[str]] = mapped_column(
        "DRIVER_PHONE", Unicode(20), nullable=True, comment="직납 운전자 연락처"
    )
    driver_vehicle_no: Mapped[Optional[str]] = mapped_column(
        "DRIVER_VEHICLE_NO", Unicode(20), nullable=True, comment="직납 운전자 차량번호"
    )
    courier_name: Mapped[Optional[str]] = mapped_column(
        "COURIER_NAME", Unicode(50), nullable=True, comment="택배사명"
    )
    courier_invoice_no: Mapped[Optional[str]] = mapped_column(
        "COURIER_INVOICE_NO", Unicode(50), nullable=True, comment="송장번호"
    )

    # ── 상태 및 확인 정보 ─────────────────────────────────────────────────────
    status: Mapped[str] = mapped_column(
        "STATUS", Unicode(2), nullable=False, default="반출", comment="상태(반출/반입)"
    )
    security_check_yn: Mapped[str] = mapped_column(
        "SECURITY_CHECK_YN", String(1), nullable=False, default="N", comment="경비실 확인 여부"
    )
    receiver_check_yn: Mapped[str] = mapped_column(
        "RECEIVER_CHECK_YN", String(1), nullable=False, default="N", comment="인수자 확인 여부"
    )

    # ── 등록/수정 감사 정보 ───────────────────────────────────────────────────
    in_date: Mapped[Optional[datetime]] = mapped_column(
        "IN_DATE", DateTime, nullable=True, comment="등록 일자"
    )
    in_user: Mapped[Optional[str]] = mapped_column(
        "IN_USER", Unicode(50), nullable=True, comment="등록자"
    )
    up_date: Mapped[Optional[datetime]] = mapped_column(
        "UP_DATE", DateTime, nullable=True, comment="수정 일자"
    )
    up_user: Mapped[Optional[str]] = mapped_column(
        "UP_USER", Unicode(50), nullable=True, comment="수정자"
    )

    # ── 관계 ──────────────────────────────────────────────────────────────────
    items: Mapped[list["Aw01011"]] = relationship(
        "Aw01011",
        back_populates="header",
        cascade="all, delete-orphan",
        order_by="Aw01011.item_seq",
    )

    def __repr__(self) -> str:
        return f"<Aw01010(doc_no='{self.doc_no}', busi_place='{self.busi_place}', status='{self.status}')>"
