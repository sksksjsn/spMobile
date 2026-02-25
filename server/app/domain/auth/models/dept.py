"""
Auth 도메인 ORM 모델
TB_DEPT - 부서 마스터
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.app.core.database import Base

if TYPE_CHECKING:
    from .user import TbUser


class TbDept(Base):
    """부서 마스터 (TB_DEPT)
    조직도 기반 부서 정보를 계층형으로 관리합니다.
    """

    __tablename__ = "TB_DEPT"

    dept_cd: Mapped[str] = mapped_column("DEPT_CD", Unicode(20), primary_key=True)
    dept_nm: Mapped[str] = mapped_column("DEPT_NM", Unicode(100), nullable=False)
    dept_eng_nm: Mapped[Optional[str]] = mapped_column("DEPT_ENG_NM", Unicode(100), nullable=True)
    parent_dept_cd: Mapped[Optional[str]] = mapped_column(
        "PARENT_DEPT_CD",
        Unicode(20),
        ForeignKey("TB_DEPT.DEPT_CD"),
        nullable=True,
    )
    dept_level: Mapped[int] = mapped_column(
        "DEPT_LEVEL", Integer, server_default=text("1"), nullable=False
    )
    sort_order: Mapped[int] = mapped_column(
        "SORT_ORDER", Integer, server_default=text("0"), nullable=False
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

    # 자기 참조 관계 (상위 부서)
    parent: Mapped[Optional["TbDept"]] = relationship(
        "TbDept", remote_side="TbDept.dept_cd", back_populates="children"
    )
    children: Mapped[list["TbDept"]] = relationship(
        "TbDept", back_populates="parent"
    )
    users: Mapped[list["TbUser"]] = relationship("TbUser", back_populates="dept")

    def __repr__(self) -> str:
        return f"<TbDept(dept_cd='{self.dept_cd}', dept_nm='{self.dept_nm}')>"
