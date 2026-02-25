"""
Auth 도메인 ORM 모델
ST00400 - 사용자 (기존 MSSQL 테이블 매핑)
"""

from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Numeric, Unicode
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .login_log import TbLoginLog
    from .token_blacklist import TbTokenBlacklist
    from .user_role import TbUserRole


class St00400(Base):
    """사용자 마스터 (ST00400)
    기존 MSSQL 사용자 테이블. USER_ID(nvarchar)가 PK이며 autoincrement 없음.
    EMP_NO(사번)와 USER_ID 조합으로 로그인. PASSWORD는 nvarchar(40) 해시값.
    """

    __tablename__ = "ST00400"

    user_id: Mapped[str] = mapped_column("USER_ID", Unicode(20), primary_key=True)
    user_name: Mapped[str] = mapped_column("USER_NAME", Unicode(30), nullable=False)
    password: Mapped[str] = mapped_column("PASSWORD", Unicode(40), nullable=False)
    user_level: Mapped[Optional[str]] = mapped_column("USER_LEVEL", Unicode(2), nullable=True)
    emp_no: Mapped[Optional[str]] = mapped_column("EMP_NO", Unicode(20), nullable=True)
    use_yn: Mapped[Optional[str]] = mapped_column("USE_YN", Unicode(1), nullable=True)
    ext_char1: Mapped[Optional[str]] = mapped_column("EXT_CHAR1", Unicode(30), nullable=True)
    ext_char2: Mapped[Optional[str]] = mapped_column("EXT_CHAR2", Unicode(30), nullable=True)
    ext_num1: Mapped[Optional[Decimal]] = mapped_column("EXT_NUM1", Numeric(18, 0), nullable=True)
    ext_num2: Mapped[Optional[Decimal]] = mapped_column("EXT_NUM2", Numeric(18, 0), nullable=True)
    remark: Mapped[Optional[str]] = mapped_column("REMARK", Unicode(100), nullable=True)
    outside_access_yn: Mapped[Optional[str]] = mapped_column(
        "OUTSIDE_ACCESS_YN", Unicode(1), nullable=True
    )
    login_fail_cnt: Mapped[Optional[Decimal]] = mapped_column(
        "LOGIN_FAIL_CNT", Numeric(18, 0), nullable=True
    )
    web_stat: Mapped[Optional[str]] = mapped_column("WEB_STAT", Unicode(4), nullable=True)

    user_roles: Mapped[list["TbUserRole"]] = relationship(
        "TbUserRole", back_populates="user", cascade="all, delete-orphan"
    )
    login_logs: Mapped[list["TbLoginLog"]] = relationship("TbLoginLog", back_populates="user")
    token_blacklists: Mapped[list["TbTokenBlacklist"]] = relationship(
        "TbTokenBlacklist", back_populates="user"
    )

    def __repr__(self) -> str:
        return f"<St00400(user_id='{self.user_id}', user_name='{self.user_name}')>"
