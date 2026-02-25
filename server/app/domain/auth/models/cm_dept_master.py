"""
Auth 도메인 ORM 모델
CM_DeptMaster - 부서 마스터 (기존 MSSQL 테이블 매핑)
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, Integer, Numeric, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base


class CmDeptMaster(Base):
    """부서 마스터 (CM_DeptMaster)
    기존 MSSQL 부서 마스터 테이블.
    (COMP_CD, BUSI_PLACE, DEPT_CODE) 복합 PK.
    FK: (COMP_CD, BUSI_PLACE) -> CM_BusiPlace (앱 내 모델 미등록으로 FK 제약 미설정)
    """

    __tablename__ = "CM_DeptMaster"

    # ── 복합 Primary Key ──────────────────────────────────────────────────────
    comp_cd: Mapped[str] = mapped_column("COMP_CD", Unicode(2), primary_key=True, comment="법인코드")
    busi_place: Mapped[str] = mapped_column(
        "BUSI_PLACE", Unicode(1), primary_key=True, comment="사업장코드"
    )
    dept_code: Mapped[str] = mapped_column(
        "DEPT_CODE", Unicode(9), primary_key=True, comment="부서코드"
    )

    # ── 부서 기본 정보 ────────────────────────────────────────────────────────
    real_dept_code: Mapped[Optional[str]] = mapped_column(
        "REAL_DEPT_CODE", Unicode(9), nullable=True, comment="실부서코드"
    )
    dept_name: Mapped[Optional[str]] = mapped_column(
        "DEPT_NAME", Unicode(50), nullable=True, comment="부서명_ko(전체)"
    )
    dept_version: Mapped[Optional[str]] = mapped_column(
        "DEPT_VERSION", Unicode(2), nullable=True, comment="부서버전"
    )
    main_office: Mapped[Optional[str]] = mapped_column(
        "MAIN_OFFICE", Unicode(3), nullable=True, comment="본부"
    )
    parent_dept_code: Mapped[Optional[str]] = mapped_column(
        "PARENT_DEPT_CODE", Unicode(9), nullable=True, comment="상위부서코드"
    )
    dept_name_en: Mapped[Optional[str]] = mapped_column(
        "DEPT_NAME_EN", Unicode(100), nullable=True, comment="부서명_en"
    )
    region: Mapped[Optional[str]] = mapped_column(
        "REGION", Unicode(2), nullable=True, comment="지역(SY12)"
    )
    dept_type: Mapped[Optional[str]] = mapped_column(
        "DEPT_TYPE", Unicode(2), nullable=True, comment="부서구분(SY13)"
    )
    plant_code: Mapped[Optional[str]] = mapped_column(
        "PLANT_CODE", Unicode(3), nullable=True, comment="공장코드"
    )

    # ── 유효기간 ──────────────────────────────────────────────────────────────
    term_fr: Mapped[Optional[datetime]] = mapped_column(
        "TERM_FR", DateTime, nullable=True, comment="기간From"
    )
    term_to: Mapped[Optional[datetime]] = mapped_column(
        "TERM_TO", DateTime, nullable=True, comment="기간To"
    )

    # ── 출력/계정 구분 ────────────────────────────────────────────────────────
    print_seq: Mapped[Optional[int]] = mapped_column(
        "PRINT_SEQ", Integer, nullable=True, comment="출력순서"
    )
    acc_type: Mapped[Optional[str]] = mapped_column(
        "ACC_TYPE", String(1), nullable=True, comment="계정구분"
    )
    prod_use_yn: Mapped[Optional[str]] = mapped_column(
        "PROD_USE_YN", String(1), nullable=True, comment="생산사용여부"
    )

    # ── 변경 정보 ─────────────────────────────────────────────────────────────
    changed_dept: Mapped[Optional[str]] = mapped_column(
        "CHANGED_DEPT", Unicode(9), nullable=True, comment="변경후부서"
    )
    changed_date: Mapped[Optional[datetime]] = mapped_column(
        "CHANGED_DATE", DateTime, nullable=True, comment="변경일자"
    )

    # ── 관리 코드 ─────────────────────────────────────────────────────────────
    mgt_char_code1: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR_CODE1", Unicode(20), nullable=True, comment="관리문자코드1(부서명)"
    )
    mgt_char_code2: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR_CODE2", Unicode(20), nullable=True, comment="관리문자코드2(영업소_코드-SA01110)"
    )
    mgt_char_code3: Mapped[Optional[str]] = mapped_column(
        "MGT_CHAR_CODE3", Unicode(20), nullable=True, comment="관리문자코드3"
    )
    mgt_num_code1: Mapped[Optional[Decimal]] = mapped_column(
        "MGT_NUM_CODE1", Numeric(18, 0), nullable=True, comment="관리숫자코드1"
    )
    mgt_num_code2: Mapped[Optional[Decimal]] = mapped_column(
        "MGT_NUM_CODE2", Numeric(18, 0), nullable=True, comment="관리숫자코드2"
    )
    mgt_num_code3: Mapped[Optional[Decimal]] = mapped_column(
        "MGT_NUM_CODE3", Numeric(18, 0), nullable=True, comment="예산 대상 여부(Y,N)"
    )

    # ── 예산/분류 ─────────────────────────────────────────────────────────────
    sector: Mapped[Optional[str]] = mapped_column(
        "SECTOR", Unicode(2), nullable=True, comment="섹터"
    )
    profit_part: Mapped[Optional[str]] = mapped_column(
        "PROFIT_PART", Unicode(9), nullable=True, comment="이익중심점"
    )
    bugt_diver_yn: Mapped[Optional[str]] = mapped_column(
        "BUGT_DIVER_YN", Unicode(1), nullable=True, comment="예산전용가능여부"
    )
    dept_group: Mapped[Optional[str]] = mapped_column(
        "DEPT_GROUP", Unicode(3), nullable=True, comment="부서그룹(SY50)"
    )
    dept_class: Mapped[Optional[str]] = mapped_column(
        "DEPT_CLASS", Unicode(3), nullable=True, comment="부서분류(SY52)"
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

    # ── 기타 ──────────────────────────────────────────────────────────────────
    sort_info: Mapped[Optional[str]] = mapped_column(
        "SORT_INFO", Unicode(10), nullable=True, comment="정렬순서(0000000)"
    )
    exist_yn: Mapped[Optional[str]] = mapped_column(
        "EXIST_YN",
        Unicode(2),
        server_default=text("'Y'"),
        nullable=True,
        comment="존재여부",
    )

    def __repr__(self) -> str:
        return (
            f"<CmDeptMaster("
            f"comp_cd='{self.comp_cd}', "
            f"busi_place='{self.busi_place}', "
            f"dept_code='{self.dept_code}', "
            f"dept_name='{self.dept_name}'"
            f")>"
        )
