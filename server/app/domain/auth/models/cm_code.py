"""
Auth 도메인 ORM 모델
CM_CodeMaster, CM_CodeDetail - 기준코드 (기존 MSSQL 테이블 매핑)
"""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime, ForeignKeyConstraint, Integer, Numeric, String, Unicode
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    pass


class CmCodeMaster(Base):
    """기준코드 마스터 (CM_CodeMaster)
    기존 MSSQL 기준코드 마스터 테이블.
    (COMP_CD, CODE_TYPE) 복합 PK.
    FK: (COMP_CD) -> CM_Corporation (앱 내 모델 미등록으로 FK 제약 미설정)
    """

    __tablename__ = "CM_CodeMaster"

    # ── 복합 Primary Key ──────────────────────────────────────────────────────
    comp_cd: Mapped[str] = mapped_column(
        "COMP_CD", Unicode(2), primary_key=True, comment="법인코드"
    )
    code_type: Mapped[str] = mapped_column(
        "CODE_TYPE", Unicode(10), primary_key=True, comment="코드구분"
    )

    # ── 코드구분 정보 ────────────────────────────────────────────────────────
    code_type_name: Mapped[Optional[str]] = mapped_column(
        "CODE_TYPE_NAME", Unicode(100), nullable=True, comment="코드구분명"
    )
    code_length: Mapped[Optional[int]] = mapped_column(
        "CODE_LENGTH", Integer, nullable=True, comment="코드길이"
    )
    mgt_lvl: Mapped[Optional[str]] = mapped_column(
        "MGT_LVL", String(1), nullable=True, comment="관리레벨"
    )
    remark: Mapped[Optional[str]] = mapped_column(
        "REMARK", Unicode(500), nullable=True, comment="비고"
    )

    # ── 관리 항목 설명 ────────────────────────────────────────────────────────
    mgt_char1: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR1", Unicode(100), nullable=True, comment="관리문자1 설명"
    )
    mgt_char2: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR2", Unicode(100), nullable=True, comment="관리문자2 설명"
    )
    mgt_char3: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR3", Unicode(100), nullable=True, comment="관리문자3 설명"
    )
    mgt_char4: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR4", Unicode(100), nullable=True, comment="관리문자4 설명"
    )
    mgt_num1: Mapped[Optional[str]] = mapped_column(
        "MGT_NUM1", Unicode(100), nullable=True, comment="관리숫자1 설명"
    )
    mgt_num2: Mapped[Optional[str]] = mapped_column(
        "MGT_NUM2", Unicode(100), nullable=True, comment="관리숫자2 설명"
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

    # ── 관계 설정 ─────────────────────────────────────────────────────────────
    details: Mapped[list["CmCodeDetail"]] = relationship(
        "CmCodeDetail", back_populates="master", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<CmCodeMaster("
            f"comp_cd='{self.comp_cd}', "
            f"code_type='{self.code_type}', "
            f"code_type_name='{self.code_type_name}'"
            f")>"
        )


class CmCodeDetail(Base):
    """기준코드 상세 (CM_CodeDetail)
    기존 MSSQL 기준코드 상세 테이블.
    (COMP_CD, CODE_TYPE, CODE) 복합 PK.
    """

    __tablename__ = "CM_CodeDetail"

    # ── 복합 Primary Key 및 Foreign Key ───────────────────────────────────────
    comp_cd: Mapped[str] = mapped_column("COMP_CD", Unicode(2), primary_key=True, comment="법인코드")
    code_type: Mapped[str] = mapped_column(
        "CODE_TYPE", Unicode(10), primary_key=True, comment="코드구분"
    )
    code: Mapped[str] = mapped_column("CODE", Unicode(20), primary_key=True, comment="코드")

    # 복합 FK 설정 (CmCodeMaster 참조)
    __table_args__ = (
        ForeignKeyConstraint(
            ["COMP_CD", "CODE_TYPE"],
            ["CM_CodeMaster.COMP_CD", "CM_CodeMaster.CODE_TYPE"],
            name="fk_CM_CodeDetail_CM_CodeMaster",
        ),
    )

    # ── 코드 상세 정보 ────────────────────────────────────────────────────────
    code_name: Mapped[Optional[str]] = mapped_column(
        "CODE_NAME", Unicode(100), nullable=True, comment="코드명"
    )
    sort_seq: Mapped[Optional[int]] = mapped_column("SORT_SEQ", Integer, nullable=True, comment="정렬순서")
    use_yn: Mapped[Optional[str]] = mapped_column("USE_YN", String(1), nullable=True, comment="사용여부")
    remark: Mapped[Optional[str]] = mapped_column("REMARK", Unicode(500), nullable=True, comment="비고")

    # ── 관리 항목 값 ──────────────────────────────────────────────────────────
    mgt_char1: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR1", Unicode(50), nullable=True, comment="관리문자1"
    )
    mgt_char2: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR2", Unicode(50), nullable=True, comment="관리문자2"
    )
    mgt_char3: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR3", Unicode(50), nullable=True, comment="관리문자3"
    )
    mgt_char4: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR4", Unicode(50), nullable=True, comment="관리문자4"
    )
    mgt_char5: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR5", Unicode(100), nullable=True, comment="관리문자5"
    )
    mgt_num1: Mapped[Optional[Decimal]] = mapped_column(
        "MGT_NUM1", Numeric(18, 0), nullable=True, comment="관리숫자1"
    )
    mgt_num2: Mapped[Optional[Decimal]] = mapped_column(
        "MGT_NUM2", Numeric(18, 0), nullable=True, comment="관리숫자2"
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

    # ── 관계 설정 ─────────────────────────────────────────────────────────────
    master: Mapped["CmCodeMaster"] = relationship("CmCodeMaster", back_populates="details")

    def __repr__(self) -> str:
        return (
            f"<CmCodeDetail("
            f"comp_cd='{self.comp_cd}', "
            f"code_type='{self.code_type}', "
            f"code='{self.code}', "
            f"code_name='{self.code_name}'"
            f")>"
        )
