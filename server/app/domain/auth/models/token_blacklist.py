"""
Auth 도메인 ORM 모델
TB_TOKEN_BLACKLIST - JWT 토큰 블랙리스트
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .user import St00400


class TbTokenBlacklist(Base):
    """JWT 토큰 블랙리스트 (TB_TOKEN_BLACKLIST)
    로그아웃 또는 강제 만료된 JWT 토큰을 관리합니다.
    USER_ID는 ST00400.USER_ID(nvarchar(20)) 참조.
    """

    __tablename__ = "TB_TOKEN_BLACKLIST"

    token_id: Mapped[int] = mapped_column(
        "TOKEN_ID", BigInteger, primary_key=True, autoincrement=True
    )
    jti: Mapped[str] = mapped_column("JTI", Unicode(100), nullable=False, unique=True)
    user_id: Mapped[str] = mapped_column(
        "USER_ID", Unicode(20), ForeignKey("ST00400.USER_ID"), nullable=False
    )
    issued_dt: Mapped[datetime] = mapped_column("ISSUED_DT", DateTime, nullable=False)
    expire_dt: Mapped[datetime] = mapped_column("EXPIRE_DT", DateTime, nullable=False)
    revoke_dt: Mapped[datetime] = mapped_column(
        "REVOKE_DT", DateTime, server_default=text("GETDATE()"), nullable=False
    )
    revoke_reason: Mapped[Optional[str]] = mapped_column(
        "REVOKE_REASON", Unicode(100), nullable=True
    )

    user: Mapped["St00400"] = relationship("St00400", back_populates="token_blacklists")

    def __repr__(self) -> str:
        return f"<TbTokenBlacklist(token_id={self.token_id}, jti='{self.jti[:20]}...')>"
