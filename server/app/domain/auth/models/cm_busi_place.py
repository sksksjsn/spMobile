"""
Auth 도메인 ORM 모델
CM_BusiPlace - 사업장 정보 (기존 MSSQL 테이블 매핑)
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Unicode
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base


class CmBusiPlace(Base):
    """사업장 정보 (CM_BusiPlace)
    기존 MSSQL 사업장 정보 테이블.
    (COMP_CD, BUSI_PLACE) 복합 PK.
    FK: (COMP_CD) -> CM_Corporation (앱 내 모델 미등록으로 FK 제약 미설정)
    """

    __tablename__ = "CM_BusiPlace"

    # ── 복합 Primary Key ──────────────────────────────────────────────────────
    comp_cd: Mapped[str] = mapped_column(
        "COMP_CD", Unicode(2), primary_key=True, comment="법인코드"
    )
    busi_place: Mapped[str] = mapped_column(
        "BUSI_PLACE", Unicode(1), primary_key=True, comment="사업장코드"
    )

    # ── 사업장 기본 정보 ──────────────────────────────────────────────────────
    business_no: Mapped[Optional[str]] = mapped_column(
        "BUSINESS_NO", Unicode(13), nullable=True, comment="사업자번호"
    )
    busi_place_name: Mapped[Optional[str]] = mapped_column(
        "BUSI_PLACE_NAME", Unicode(50), nullable=True, comment="사업장명_ko"
    )
    busi_place_name_en: Mapped[Optional[str]] = mapped_column(
        "BUSI_PLACE_NAME_EN", Unicode(100), nullable=True, comment="사업장명_en"
    )
    busi_place_sht_name: Mapped[Optional[str]] = mapped_column(
        "BUSI_PLACE_SHT_NAME", Unicode(50), nullable=True, comment="약칭"
    )
    rep_busi_place_yn: Mapped[Optional[str]] = mapped_column(
        "REP_BUSI_PLACE_YN", String(1), nullable=True, comment="대표 사업장 여부"
    )
    president: Mapped[Optional[str]] = mapped_column(
        "PRESIDENT", Unicode(50), nullable=True, comment="대표자_ko"
    )
    president_en: Mapped[Optional[str]] = mapped_column(
        "PRESIDENT_EN", Unicode(100), nullable=True, comment="대표자_en"
    )
    biz_type: Mapped[Optional[str]] = mapped_column(
        "BIZ_TYPE", Unicode(100), nullable=True, comment="업태"
    )
    biz_item: Mapped[Optional[str]] = mapped_column(
        "BIZ_ITEM", Unicode(100), nullable=True, comment="종목"
    )

    # ── 주소 및 연락처 ──────────────────────────────────────────────────────
    zip_code: Mapped[Optional[str]] = mapped_column(
        "ZIP_CODE", Unicode(6), nullable=True, comment="우편번호"
    )
    addr: Mapped[Optional[str]] = mapped_column(
        "ADDR", Unicode(200), nullable=True, comment="주소_ko"
    )
    addr_en: Mapped[Optional[str]] = mapped_column(
        "ADDR_EN", Unicode(300), nullable=True, comment="주소_en"
    )
    tel_no: Mapped[Optional[str]] = mapped_column(
        "TEL_NO", Unicode(25), nullable=True, comment="전화번호"
    )
    fax_no: Mapped[Optional[str]] = mapped_column(
        "FAX_NO", Unicode(25), nullable=True, comment="팩스번호"
    )

    # ── 전자신고/세무 정보 ────────────────────────────────────────────────────
    tax_office_code: Mapped[Optional[str]] = mapped_column(
        "TAX_OFFICE_CODE", Unicode(4), nullable=True, comment="세무서코드"
    )
    hometax_id: Mapped[Optional[str]] = mapped_column(
        "HOMETAX_ID", Unicode(10), nullable=True, comment="전자신고UserID"
    )
    slave_busi_no: Mapped[Optional[str]] = mapped_column(
        "SLAVE_BUSI_NO", Unicode(4), nullable=True, comment="단위사업장적용번호"
    )
    sum_recog_no: Mapped[Optional[str]] = mapped_column(
        "SUM_RECOG_NO", Unicode(7), nullable=True, comment="총괄(단위)승인번호"
    )
    prsd_sec_no: Mapped[Optional[str]] = mapped_column(
        "PRSD_SEC_NO", Unicode(13), nullable=True, comment="대표자 주민번호"
    )

    # ── 기타 정보 ─────────────────────────────────────────────────────────────
    homepage: Mapped[Optional[str]] = mapped_column(
        "HOMEPAGE", Unicode(100), nullable=True, comment="홈페이지"
    )
    cust_code: Mapped[Optional[str]] = mapped_column(
        "CUST_CODE", Unicode(10), nullable=True, comment="사업부문(SY60)"
    )
    item_code: Mapped[Optional[str]] = mapped_column(
        "ITEM_CODE", Unicode(6), nullable=True, comment="종목 코드"
    )
    biz_date: Mapped[Optional[datetime]] = mapped_column(
        "BIZ_DATE", DateTime, nullable=True, comment="개업 일자"
    )
    resi_tx_place: Mapped[Optional[str]] = mapped_column(
        "RESI_TX_PLACE", Unicode(11), nullable=True, comment="주민세납세지(특수강:사업장기준으로필수)"
    )
    remark: Mapped[Optional[str]] = mapped_column(
        "REMARK", Unicode(100), nullable=True, comment="비고"
    )

    # ── 등록/수정 감사 정보 ───────────────────────────────────────────────────
    in_date: Mapped[Optional[datetime]] = mapped_column(
        "IN_DATE", DateTime, nullable=True, comment="등록 일자"
    )
    in_user: Mapped[Optional[str]] = mapped_column(
        "IN_USER", Unicode(20), nullable=True, comment="등록자"
    )
    up_date: Mapped[Optional[datetime]] = mapped_column(
        "UP_DATE", DateTime, nullable=True, comment="수정 일자"
    )
    up_user: Mapped[Optional[str]] = mapped_column(
        "UP_USER", Unicode(20), nullable=True, comment="수정자"
    )

    def __repr__(self) -> str:
        return (
            f"<CmBusiPlace("
            f"comp_cd='{self.comp_cd}', "
            f"busi_place='{self.busi_place}', "
            f"busi_place_name='{self.busi_place_name}'"
            f")>"
        )
