"""
Board 도메인 ORM 모델
WB_BOARD_INFO - 공지사항/게시판 정보 (기존 MSSQL 테이블 매핑)
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Unicode, UnicodeText
from sqlalchemy.orm import Mapped, mapped_column

from server.app.core.database import Base


class WbBoardInfo(Base):
    """게시판 정보 (WB_BOARD_INFO)
    공지사항 및 게시물 정보를 관리하는 테이블.
    (PROJECT_CD, MENU_CD, BOARD_SEQ) 복합 PK.
    """

    __tablename__ = "WB_BOARD_INFO"

    # ── 복합 Primary Key ──────────────────────────────────────────────────────
    project_cd: Mapped[str] = mapped_column(
        "PROJECT_CD", Unicode(10), primary_key=True, comment="프로젝트코드"
    )
    menu_cd: Mapped[str] = mapped_column(
        "MENU_CD", Unicode(5), primary_key=True, comment="메뉴코드"
    )
    board_seq: Mapped[str] = mapped_column(
        "BOARD_SEQ", Unicode(10), primary_key=True, comment="게시물순번"
    )

    # ── 게시물 기본 정보 ────────────────────────────────────────────────────────
    board_title: Mapped[Optional[str]] = mapped_column(
        "BOARD_TITLE", Unicode(250), nullable=True, comment="제목"
    )
    board_txt: Mapped[Optional[str]] = mapped_column(
        "BOARD_TXT", UnicodeText, nullable=True, comment="내용"
    )
    import_yn: Mapped[Optional[str]] = mapped_column(
        "IMPORT_YN", String(1), nullable=True, comment="중요여부"
    )
    popup_yn: Mapped[Optional[str]] = mapped_column(
        "POPUP_YN", String(1), nullable=True, comment="팝업여부"
    )
    popup_start_dt: Mapped[Optional[str]] = mapped_column(
        "POPUP_START_DT", Unicode(8), nullable=True, comment="팝업시작일"
    )
    popup_end_dt: Mapped[Optional[str]] = mapped_column(
        "POPUP_END_DT", Unicode(8), nullable=True, comment="팝업종료일"
    )
    board_attach: Mapped[Optional[str]] = mapped_column(
        "BOARD_ATTACH", Unicode(36), nullable=True, comment="첨부파일ID"
    )

    # ── 등록/수정 정보 ──────────────────────────────────────────────────────
    reg_dt: Mapped[Optional[datetime]] = mapped_column(
        "REG_DT", DateTime, nullable=True, comment="등록일시"
    )
    reg_cd: Mapped[Optional[str]] = mapped_column(
        "REG_CD", Unicode(10), nullable=True, comment="등록자코드"
    )
    mod_dt: Mapped[Optional[datetime]] = mapped_column(
        "MOD_DT", DateTime, nullable=True, comment="수정일시"
    )
    mod_cd: Mapped[Optional[str]] = mapped_column(
        "MOD_CD", Unicode(10), nullable=True, comment="수정자코드"
    )

    # ── 기타 ──────────────────────────────────────────────────────────────────
    board_category: Mapped[Optional[str]] = mapped_column(
        "BOARD_CATEGORY", Unicode(2), nullable=True, comment="게시물카테고리"
    )
    wb_board_info_flag: Mapped[Optional[str]] = mapped_column(
        "WB_BOARD_INFO", Unicode(1), nullable=True, comment="게시판정보플래그"
    )

    def __repr__(self) -> str:
        return (
            f"<WbBoardInfo("
            f"project_cd='{self.project_cd}', "
            f"menu_cd='{self.menu_cd}', "
            f"board_seq='{self.board_seq}', "
            f"board_title='{self.board_title}'"
            f")>"
        )
