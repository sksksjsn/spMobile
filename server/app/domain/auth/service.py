"""
Auth 도메인 Service
로그인 검증, JWT 발급, 로그아웃 처리
"""

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.core.config import settings
from server.app.domain.auth.calculators.password_calculator import PasswordCalculator
from server.app.domain.auth.repositories.user_repository import UserRepository
from server.app.domain.auth.schemas import AuthUserSchema, LoginRequest, LoginResponse
from server.app.shared.exceptions import UnauthorizedException

logger = logging.getLogger(__name__)

ALGORITHM = "HS256"


class AuthService:
    """
    인증 Service

    로그인 검증 조건:
    - USER_ID 존재 여부
    - PASSWORD 일치 여부 (MD5 → Base64 방식)
    - USE_YN == 'Y'
    """

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.pw_calc = PasswordCalculator()

    async def login(self, request: LoginRequest) -> LoginResponse:
        """
        로그인 처리 및 JWT 발급

        Args:
            request: 로그인 요청 (login_id, password)

        Returns:
            LoginResponse: 액세스 토큰 및 사용자 정보

        Raises:
            UnauthorizedException: 인증 실패 시
        """
        user = await self.user_repo.get_user_by_id(request.login_id)

        if user is None:
            logger.warning(f"Login failed - user not found: {request.login_id}")
            raise UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.")

        if user.use_yn != "Y":
            logger.warning(f"Login failed - inactive user: {request.login_id}")
            raise UnauthorizedException("사용이 중지된 계정입니다. 관리자에게 문의하세요.")

        if not self.pw_calc.verify(request.password, user.password):
            logger.warning(f"Login failed - password mismatch: {request.login_id}")
            raise UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.")

        role_codes = await self.user_repo.get_role_codes_by_user_id(user.user_id)
        access_token = self._create_access_token(user.user_id)

        user_schema = AuthUserSchema(
            user_id=user.user_id,
            login_id=user.user_id,
            user_name=user.user_name,
            email=None,
            dept_cd=user.ext_char1,
            position_nm=user.ext_char2,
            role_codes=role_codes,
        )

        logger.info(f"Login successful: {request.login_id}")
        return LoginResponse(access_token=access_token, token_type="bearer", user=user_schema)

    def _create_access_token(self, user_id: str) -> str:
        """JWT 액세스 토큰 생성"""
        now = datetime.now(tz=timezone.utc)
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        payload = {
            "sub": user_id,
            "jti": str(uuid.uuid4()),
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decode_token(token: str) -> dict:
        """
        JWT 토큰을 검증하고 페이로드를 반환합니다.

        Args:
            token: Bearer 토큰 문자열

        Returns:
            dict: 토큰 페이로드

        Raises:
            UnauthorizedException: 토큰이 유효하지 않거나 만료된 경우
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            raise UnauthorizedException("유효하지 않거나 만료된 토큰입니다.")
