"""
Auth 도메인 ORM 모델
TB_USER - 사용자 마스터
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .dept import TbDept
    from .login_log import TbLoginLog
    from .token_blacklist import TbTokenBlacklist
    from .user_role import TbUserRole


class TbUser(Base):
    """사용자 마스터 (TB_USER)
    사용자 기본 정보 및 인증 정보를 관리합니다.
    비밀번호는 반드시 bcrypt 해시값으로 저장합니다.
    """

    __tablename__ = "TB_USER"

    user_id: Mapped[int] = mapped_column(
        "USER_ID", Integer, primary_key=True, autoincrement=True
    )
    login_id: Mapped[str] = mapped_column("LOGIN_ID", Unicode(50), nullable=False, unique=True)
    password: Mapped[str] = mapped_column("PASSWORD", Unicode(256), nullable=False)
    user_name: Mapped[str] = mapped_column("USER_NAME", Unicode(50), nullable=False)
    email: Mapped[Optional[str]] = mapped_column("EMAIL", Unicode(100), nullable=True)
    dept_cd: Mapped[Optional[str]] = mapped_column(
        "DEPT_CD",
        Unicode(20),
        ForeignKey("TB_DEPT.DEPT_CD"),
        nullable=True,
    )
    position_nm: Mapped[Optional[str]] = mapped_column(
        "POSITION_NM", Unicode(30), nullable=True
    )
    phone_no: Mapped[Optional[str]] = mapped_column("PHONE_NO", Unicode(20), nullable=True)
    mobile_no: Mapped[Optional[str]] = mapped_column("MOBILE_NO", Unicode(20), nullable=True)
    profile_img: Mapped[Optional[str]] = mapped_column(
        "PROFILE_IMG", Unicode(500), nullable=True
    )
    last_login_dt: Mapped[Optional[datetime]] = mapped_column(
        "LAST_LOGIN_DT", DateTime, nullable=True
    )
    pwd_change_dt: Mapped[Optional[datetime]] = mapped_column(
        "PWD_CHANGE_DT", DateTime, nullable=True
    )
    login_fail_cnt: Mapped[int] = mapped_column(
        "LOGIN_FAIL_CNT", Integer, server_default=text("0"), nullable=False
    )
    lock_yn: Mapped[str] = mapped_column(
        "LOCK_YN", String(1), server_default=text("'N'"), nullable=False
    )
    use_yn: Mapped[str] = mapped_column(
        "USE_YN", String(1), server_default=text("'Y'"), nullable=False
    )
    create_dt: Mapped[datetime] = mapped_column(
        "CREATE_DT", DateTime, server_default=text("GETDATE()"), nullable=False
    )
    create_user: Mapped[str] = mapped_column(
        "CREATE_USER", Unicode(50), server_default=text("'SYSTEM'"), nullable=False
    )
    update_dt: Mapped[Optional[datetime]] = mapped_column("UPDATE_DT", DateTime, nullable=True)
    update_user: Mapped[Optional[str]] = mapped_column(
        "UPDATE_USER", Unicode(50), nullable=True
    )

    dept: Mapped[Optional["TbDept"]] = relationship("TbDept", back_populates="users")
    user_roles: Mapped[list["TbUserRole"]] = relationship(
        "TbUserRole", back_populates="user", cascade="all, delete-orphan"
    )
    login_logs: Mapped[list["TbLoginLog"]] = relationship("TbLoginLog", back_populates="user")
    token_blacklists: Mapped[list["TbTokenBlacklist"]] = relationship(
        "TbTokenBlacklist", back_populates="user"
    )

    def __repr__(self) -> str:
        return f"<TbUser(user_id={self.user_id}, login_id='{self.login_id}')>"
