"""
Auth 도메인 ORM 모델
TB_ROLE - 권한 역할 마스터
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Integer, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .user_role import TbUserRole


class TbRole(Base):
    """권한 역할 (TB_ROLE)
    RBAC(Role-Based Access Control) 기반 권한 정의 테이블.
    """

    __tablename__ = "TB_ROLE"

    role_id: Mapped[int] = mapped_column(
        "ROLE_ID", Integer, primary_key=True, autoincrement=True
    )
    role_cd: Mapped[str] = mapped_column("ROLE_CD", Unicode(30), nullable=False, unique=True)
    role_nm: Mapped[str] = mapped_column("ROLE_NM", Unicode(50), nullable=False)
    role_desc: Mapped[Optional[str]] = mapped_column("ROLE_DESC", Unicode(200), nullable=True)
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

    user_roles: Mapped[list["TbUserRole"]] = relationship("TbUserRole", back_populates="role")

    def __repr__(self) -> str:
        return f"<TbRole(role_cd='{self.role_cd}', role_nm='{self.role_nm}')>"
