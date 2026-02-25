import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/useAuthStore';
import { toast } from '@/core/utils/toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('epro-saved-id');
    if (saved) {
      setLoginId(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('epro-saved-id', loginId);
    } else {
      localStorage.removeItem('epro-saved-id');
    }

    setIsLoading(true);
    try {
      await login(loginId, password);
      navigate('/');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page min-h-dvh flex flex-col bg-white">
      {/* ── 상단 브랜드 헤더 ── */}
      <header className="flex-shrink-0 bg-[#53565A] px-6 py-4">
        <div className="flex items-center gap-3">
          {/* SeAH CI 심볼 – 꺾쇠(>) 모양 */}
          <svg
            viewBox="0 0 48 48"
            className="w-9 h-9 flex-shrink-0"
            aria-label="SeAH Symbol"
          >
            <rect width="48" height="48" rx="4" fill="#E94E1B" />
            <path
              d="M14 10L34 24L14 38"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-[15px] tracking-wide">
              세아특수강
            </span>
            <span className="text-white/60 text-[11px] tracking-widest font-medium">
              SeAH Special Steel
            </span>
          </div>
        </div>
      </header>

      {/* ── 메인 컨텐츠 영역 ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          {/* 타이틀 영역 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E94E1B]/8 rounded-full mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E94E1B]" />
              <span className="text-[#E94E1B] text-xs font-semibold tracking-wide">
                SEAH CI
              </span>
            </div>
            <h1 className="text-[#53565A] text-[26px] font-bold leading-tight">
              전자구매 시스템
            </h1>
            <p className="text-[#53565A]/50 text-sm mt-2">
              사번과 비밀번호로 로그인하세요
            </p>
          </div>

          {/* ── 로그인 카드 ── */}
          <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* 아이디 필드 */}
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-[13px] font-semibold text-[#53565A] mb-2"
                >
                  아이디 (사번)
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#53565A]/30">
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    id="loginId"
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="사번을 입력하세요"
                    autoComplete="username"
                    disabled={isLoading}
                    className="w-full h-[50px] pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl
                               text-[#53565A] text-[15px] placeholder:text-gray-300
                               focus:outline-none focus:border-[#E94E1B] focus:ring-2 focus:ring-[#E94E1B]/10
                               focus:bg-white
                               disabled:bg-gray-100 disabled:text-gray-400
                               transition-all duration-200"
                  />
                </div>
              </div>

              {/* 비밀번호 필드 */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[13px] font-semibold text-[#53565A] mb-2"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#53565A]/30">
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full h-[50px] pl-11 pr-12 bg-gray-50 border border-gray-200 rounded-xl
                               text-[#53565A] text-[15px] placeholder:text-gray-300
                               focus:outline-none focus:border-[#E94E1B] focus:ring-2 focus:ring-[#E94E1B]/10
                               focus:bg-white
                               disabled:bg-gray-100 disabled:text-gray-400
                               transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-[#53565A] transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? (
                      <svg
                        className="w-[18px] h-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        className="w-[18px] h-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ID 저장 체크박스 */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div
                  className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center
                              transition-all duration-200 ${
                                rememberMe
                                  ? 'bg-[#E94E1B] border-[#E94E1B]'
                                  : 'border-gray-300 group-hover:border-gray-400'
                              }`}
                  onClick={() => setRememberMe((v) => !v)}
                >
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-[#53565A]/70 group-hover:text-[#53565A] transition-colors">
                  아이디 저장
                </span>
              </label>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] bg-[#E94E1B] text-white font-bold text-[15px] rounded-xl
                           hover:bg-[#D4451A] active:scale-[0.98]
                           disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100
                           transition-all duration-200 flex items-center justify-center gap-2
                           shadow-[0_4px_12px_rgba(233,78,27,0.3)]
                           hover:shadow-[0_6px_20px_rgba(233,78,27,0.4)]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </button>
            </form>
          </div>

          {/* 하단 링크 */}
          <div className="mt-5 flex items-center justify-center gap-6 text-[13px] text-[#53565A]/40">
            <a
              href="#"
              className="hover:text-[#E94E1B] transition-colors"
            >
              비밀번호 찾기
            </a>
            <span className="w-px h-3 bg-gray-200" />
            <a
              href="#"
              className="hover:text-[#E94E1B] transition-colors"
            >
              계정 문의
            </a>
          </div>
        </div>
      </main>

      {/* ── 하단 푸터 ── */}
      <footer className="flex-shrink-0 py-5 text-center border-t border-gray-100">
        <p className="text-[11px] text-[#53565A]/30 leading-relaxed">
          © 2026 SeAH Special Steel Co., Ltd.
          <br />
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}
