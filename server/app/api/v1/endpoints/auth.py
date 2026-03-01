"""
Auth API 엔드포인트
로그인 / 로그아웃
"""

import logging

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.dependencies import get_current_user, get_database_session
from server.app.domain.auth.schemas import LoginRequest, LoginResponse
from server.app.domain.auth.service import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="로그인",
    description="사용자 ID와 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.",
    response_model_by_alias=True,
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_database_session),
) -> LoginResponse:
    """
    로그인 엔드포인트

    - **loginId**: 사용자 ID (사번)
    - **password**: 평문 비밀번호 (서버에서 MD5→Base64 변환 후 대조)
    """
    service = AuthService(db)
    return await service.login(request)


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="로그아웃",
    description="현재 세션을 종료합니다.",
)
async def logout(
    current_user: dict = Depends(get_current_user),
) -> None:
    """
    로그아웃 엔드포인트

    클라이언트는 로컬 스토리지의 토큰을 삭제해야 합니다.
    추후 토큰 블랙리스트 기능 확장 가능.
    """
    logger.info(f"Logout: user_id={current_user.get('sub')}")
