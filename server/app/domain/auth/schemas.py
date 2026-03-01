"""
Auth 도메인 Pydantic 스키마
"""

from typing import Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """로그인 요청"""

    login_id: str = Field(..., description="사용자 ID (사번)", alias="loginId")
    password: str = Field(..., description="비밀번호")

    model_config = {"populate_by_name": True}


class AuthUserSchema(BaseModel):
    """인증된 사용자 정보 (응답용)"""

    user_id: str = Field(..., description="사용자 ID", serialization_alias="userId")
    login_id: str = Field(..., description="로그인 ID", serialization_alias="loginId")
    user_name: str = Field(..., description="사용자명", serialization_alias="userName")
    email: Optional[str] = Field(None, description="이메일")
    dept_cd: Optional[str] = Field(None, description="부서코드", serialization_alias="deptCd")
    position_nm: Optional[str] = Field(
        None, description="직위명", serialization_alias="positionNm"
    )
    role_codes: list[str] = Field(
        default_factory=list, description="권한 코드 목록", serialization_alias="roleCodes"
    )

    model_config = {"from_attributes": True, "populate_by_name": True}


class LoginResponse(BaseModel):
    """로그인 응답"""

    access_token: str = Field(..., description="JWT 액세스 토큰", serialization_alias="accessToken")
    token_type: str = Field(default="bearer", description="토큰 타입", serialization_alias="tokenType")
    user: AuthUserSchema = Field(..., description="인증된 사용자 정보")

    model_config = {"populate_by_name": True}


class TokenPayload(BaseModel):
    """JWT 토큰 페이로드"""

    sub: str = Field(..., description="사용자 ID (subject)")
    jti: str = Field(..., description="토큰 고유 ID")
    exp: int = Field(..., description="만료 시각 (Unix timestamp)")
    iat: int = Field(..., description="발급 시각 (Unix timestamp)")
