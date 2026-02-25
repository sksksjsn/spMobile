import { useState, useEffect, type FormEvent } from 'react';
import { Eye, EyeOff, User, Lock, ChevronRight } from 'lucide-react';

const SAVED_ID_KEY = 'seah-epro-saved-id';
const SAVED_REMEMBER_KEY = 'seah-epro-remember-id';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  // 저장된 ID 불러오기
  useEffect(() => {
    const savedRemember = localStorage.getItem(SAVED_REMEMBER_KEY) === 'true';
    if (savedRemember) {
      const savedId = localStorage.getItem(SAVED_ID_KEY) || '';
      setLoginId(savedId);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // ID 저장 처리
    if (rememberMe) {
      localStorage.setItem(SAVED_ID_KEY, loginId);
      localStorage.setItem(SAVED_REMEMBER_KEY, 'true');
    } else {
      localStorage.removeItem(SAVED_ID_KEY);
      localStorage.removeItem(SAVED_REMEMBER_KEY);
    }

    setIsLoading(true);

    // TODO: 실제 백엔드 API 연동
    // 현재는 UI 데모용 딜레이
    setTimeout(() => {
      setIsLoading(false);
      alert(`로그인 시도: ${loginId}`);
    }, 1500);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-seah-gray-50 px-5 py-8">
      {/* 상단 장식 그래디언트 */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 h-[280px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0B5FBB 0%, #3D7FE8 40%, #669DFD 70%, #ADCFFF 100%)',
          }}
        />
        <div
          className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
        <div
          className="absolute -top-8 -left-8 h-48 w-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
        {/* 하단 곡선 */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L0 80C240 20 480 0 720 20C960 40 1200 80 1440 60L1440 120H0Z"
            fill="var(--color-seah-gray-50)"
          />
        </svg>
      </div>

      {/* 로고 + 타이틀 영역 */}
      <div className="relative z-10 mb-8 flex animate-fade-in flex-col items-center">
        {/* 로고 Placeholder */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
          <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
            <rect width="40" height="40" rx="8" fill="#0B5FBB" />
            <text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Pretendard, sans-serif"
              fontWeight="700"
              fontSize="20"
              fill="white"
            >
              S
            </text>
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">SeAH ePro</h1>
        <p className="mt-1 text-sm font-medium text-white/70">전자구매 모바일 시스템</p>
      </div>

      {/* 로그인 카드 */}
      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-6 text-center text-lg font-semibold text-seah-gray-800">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 입력 필드 */}
            <div>
              <label
                htmlFor="loginId"
                className="mb-1.5 block text-sm font-medium text-seah-gray-600"
              >
                아이디
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 transition-all duration-200 ${
                  idFocused
                    ? 'border-seah-blue-600 shadow-input-focus'
                    : 'border-seah-gray-200 hover:border-seah-gray-300'
                }`}
              >
                <User
                  size={18}
                  className={`shrink-0 transition-colors duration-200 ${
                    idFocused ? 'text-seah-blue-600' : 'text-seah-gray-400'
                  }`}
                />
                <input
                  id="loginId"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  onFocus={() => setIdFocused(true)}
                  onBlur={() => setIdFocused(false)}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  className="w-full bg-transparent text-sm text-seah-gray-800 outline-none placeholder:text-seah-gray-400"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 필드 */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-seah-gray-600"
              >
                비밀번호
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 transition-all duration-200 ${
                  pwFocused
                    ? 'border-seah-blue-600 shadow-input-focus'
                    : 'border-seah-gray-200 hover:border-seah-gray-300'
                }`}
              >
                <Lock
                  size={18}
                  className={`shrink-0 transition-colors duration-200 ${
                    pwFocused ? 'text-seah-blue-600' : 'text-seah-gray-400'
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm text-seah-gray-800 outline-none placeholder:text-seah-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 rounded-lg p-0.5 text-seah-gray-400 transition-colors hover:text-seah-gray-600 focus:outline-none"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ID 저장 체크박스 */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-all duration-200 ${
                  rememberMe
                    ? 'border-seah-blue-600 bg-seah-blue-600'
                    : 'border-seah-gray-300 bg-white hover:border-seah-gray-400'
                }`}
              >
                {rememberMe && (
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className="cursor-pointer select-none text-sm text-seah-gray-500"
                onClick={() => setRememberMe(!rememberMe)}
              >
                아이디 저장
              </span>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !loginId || !password}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-seah-blue-700 py-3.5 text-sm font-semibold text-white shadow-button transition-all duration-200 hover:bg-seah-blue-600 hover:shadow-button-hover focus:outline-none focus:ring-2 focus:ring-seah-blue-400 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <span>로그인</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 하단 안내 */}
        <div className="mt-5 text-center">
          <p className="text-xs leading-relaxed text-seah-gray-400">
            접속 문의: IT팀 (내선 1234)
          </p>
        </div>
      </div>

      {/* 하단 저작권 */}
      <div className="relative z-10 mt-auto pt-8">
        <p className="text-center text-[11px] text-seah-gray-400">
          &copy; {new Date().getFullYear()} SeAH Steel Holdings. All rights reserved.
        </p>
      </div>
    </div>
  );
}
