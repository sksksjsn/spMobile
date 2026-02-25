import { useState, type FormEvent } from 'react';
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      await login(loginId, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── 왼쪽 브랜드 패널 ── */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between overflow-hidden bg-[#002855]">
        {/* 배경 패턴 */}
        <div className="absolute inset-0">
          {/* 기하학 원 장식 */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute -top-16 -left-16 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full border border-white/5" />
          <div className="absolute top-1/3 -right-12 w-80 h-80 rounded-full border border-white/5" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#001933]/80 to-transparent" />
          {/* 강철 라인 그래픽 */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A951]/30 to-transparent" />
          <div className="absolute top-1/2 mt-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A951]/15 to-transparent" />
        </div>

        {/* 로고 영역 */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A951] flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6 fill-white">
                <rect x="4" y="4" width="14" height="14" />
                <rect x="22" y="4" width="14" height="14" />
                <rect x="4" y="22" width="14" height="14" />
                <rect x="22" y="22" width="14" height="14" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-widest">SeAH</span>
              <span className="text-[#C8A951] font-light text-xl tracking-widest ml-1">Special Steel</span>
            </div>
          </div>
        </div>

        {/* 중앙 메인 카피 */}
        <div className="relative z-10 px-12 pb-4">
          <p className="text-[#C8A951] text-sm font-medium tracking-[0.3em] mb-4 uppercase">
            SeAH Special Steel
          </p>
          <h1 className="text-white text-5xl font-bold leading-tight mb-6">
            더 강하게,<br />
            더 가볍게,<br />
            <span className="text-[#C8A951]">더 아름답게</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            세아특수강 스마트 업무 포털에 오신 것을 환영합니다.<br />
            더 나은 내일을 위해 함께 합니다.
          </p>

          {/* 수평선 장식 */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-8 h-0.5 bg-[#C8A951]" />
            <div className="w-2 h-2 bg-[#C8A951] rotate-45" />
          </div>
        </div>

        {/* 하단 통계 */}
        <div className="relative z-10 px-12 pb-12">
          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-[#C8A951] text-2xl font-bold">1966</p>
              <p className="text-white/40 text-xs mt-1 tracking-wide">창립 연도</p>
            </div>
            <div>
              <p className="text-[#C8A951] text-2xl font-bold">60+</p>
              <p className="text-white/40 text-xs mt-1 tracking-wide">업력</p>
            </div>
            <div>
              <p className="text-[#C8A951] text-2xl font-bold">Global</p>
              <p className="text-white/40 text-xs mt-1 tracking-wide">글로벌 네트워크</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 오른쪽 로그인 폼 패널 ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white">
        {/* 모바일 로고 */}
        <div className="lg:hidden mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#002855] flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-4 h-4 fill-white">
              <rect x="4" y="4" width="14" height="14" />
              <rect x="22" y="4" width="14" height="14" />
              <rect x="4" y="22" width="14" height="14" />
              <rect x="22" y="22" width="14" height="14" />
            </svg>
          </div>
          <span className="text-[#002855] font-bold tracking-widest text-lg">SeAH</span>
          <span className="text-[#C8A951] font-bold tracking-widest text-lg">Special Steel</span>
        </div>

        <div className="max-w-sm w-full mx-auto">
          {/* 헤더 */}
          <div className="mb-10">
            <p className="text-[#C8A951] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
              Smart Work Portal
            </p>
            <h2 className="text-[#002855] text-3xl font-bold">로그인</h2>
            <p className="text-slate-400 text-sm mt-2">업무 포털에 오신 것을 환영합니다.</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* 아이디 */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase"
              >
                아이디 (사번)
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800
                           placeholder:text-slate-300 text-sm
                           focus:outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10
                           disabled:bg-slate-50 disabled:text-slate-400
                           transition-colors duration-200"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg text-slate-800
                             placeholder:text-slate-300 text-sm
                             focus:outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10
                             disabled:bg-slate-50 disabled:text-slate-400
                             transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#002855] text-white font-semibold text-sm rounded-lg
                         hover:bg-[#003a7a] active:bg-[#001d3d]
                         disabled:bg-slate-300 disabled:cursor-not-allowed
                         transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <a href="#" className="hover:text-[#002855] transition-colors">
              비밀번호 찾기
            </a>
            <span className="w-px h-3 bg-slate-200" />
            <a href="#" className="hover:text-[#002855] transition-colors">
              계정 문의
            </a>
          </div>

          {/* 구분선 */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-xs text-slate-300">
              © 2026 SeAH Special Steel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
