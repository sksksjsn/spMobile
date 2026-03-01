export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface AuthUser {
  userId: string;
  loginId: string;
  userName: string;
  email: string | null;
  deptCd: string | null;
  positionNm: string | null;
  roleCodes: string[];
}
