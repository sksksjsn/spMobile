"""
Auth 도메인 ORM 모델
TB_USER_ROLE - 사용자-역할 매핑 (N:M)
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .role import TbRole
    from .user import TbUser


class TbUserRole(Base):
    """사용자-역할 매핑 (TB_USER_ROLE)
    사용자와 역할의 N:M 관계를 관리합니다. (복합 PK)
    """

    __tablename__ = "TB_USER_ROLE"

    user_id: Mapped[int] = mapped_column(
        "USER_ID", Integer, ForeignKey("TB_USER.USER_ID"), primary_key=True
    )
    role_id: Mapped[int] = mapped_column(
        "ROLE_ID", Integer, ForeignKey("TB_ROLE.ROLE_ID"), primary_key=True
    )
    grant_dt: Mapped[datetime] = mapped_column(
        "GRANT_DT", DateTime, server_default=text("GETDATE()"), nullable=False
    )
    grant_user: Mapped[str] = mapped_column("GRANT_USER", Unicode(50), nullable=False)
    expire_dt: Mapped[Optional[datetime]] = mapped_column(
        "EXPIRE_DT", DateTime, nullable=True
    )
    use_yn: Mapped[str] = mapped_column(
        "USE_YN", String(1), server_default=text("'Y'"), nullable=False
    )

    user: Mapped["TbUser"] = relationship("TbUser", back_populates="user_roles")
    role: Mapped["TbRole"] = relationship("TbRole", back_populates="user_roles")

    def __repr__(self) -> str:
        return f"<TbUserRole(user_id={self.user_id}, role_id={self.role_id})>"
