"""
Auth 도메인 ORM 모델
TB_LOGIN_LOG - 로그인 이력
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .user import St00400


class TbLoginLog(Base):
    """로그인 이력 (TB_LOGIN_LOG)
    보안 감사 및 접속 이력 추적을 위한 로그인/로그아웃 기록.
    USER_ID는 ST00400.USER_ID(nvarchar(20)) 참조.
    """

    __tablename__ = "TB_LOGIN_LOG"

    log_id: Mapped[int] = mapped_column(
        "LOG_ID", BigInteger, primary_key=True, autoincrement=True
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        "USER_ID", Unicode(20), ForeignKey("ST00400.USER_ID"), nullable=True
    )
    login_id: Mapped[str] = mapped_column("LOGIN_ID", Unicode(50), nullable=False)
    login_dt: Mapped[datetime] = mapped_column(
        "LOGIN_DT", DateTime, server_default=text("GETDATE()"), nullable=False
    )
    logout_dt: Mapped[Optional[datetime]] = mapped_column("LOGOUT_DT", DateTime, nullable=True)
    ip_addr: Mapped[str] = mapped_column("IP_ADDR", Unicode(50), nullable=False)
    user_agent: Mapped[Optional[str]] = mapped_column("USER_AGENT", Unicode(500), nullable=True)
    success_yn: Mapped[str] = mapped_column("SUCCESS_YN", String(1), nullable=False)
    fail_reason: Mapped[Optional[str]] = mapped_column(
        "FAIL_REASON", Unicode(200), nullable=True
    )

    user: Mapped[Optional["St00400"]] = relationship("St00400", back_populates="login_logs")

    def __repr__(self) -> str:
        return (
            f"<TbLoginLog(log_id={self.log_id}, login_id='{self.login_id}', "
            f"success='{self.success_yn}')>"
        )
