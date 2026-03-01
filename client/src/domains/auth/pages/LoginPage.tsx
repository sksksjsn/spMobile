import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
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
  const [errorPopup, setErrorPopup] = useState<string | null>(null);

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
          : '아이디 / 패스워드가 일치하지 않습니다.';
      setErrorPopup(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white lg:flex">
      {/* ── Left Brand Panel (desktop only) ─────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col items-center justify-center bg-seah-gray-500 px-12 py-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-20 size-72 rounded-full bg-seah-orange-500/10" />
        <div className="absolute top-1/3 right-8 size-40 rounded-full bg-white/3" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          {/* Logo icon */}
          <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <Layers size={32} className="text-white" strokeWidth={2} />
          </div>

          <div className="mb-2 text-2xl font-extrabold uppercase tracking-wide text-seah-orange-400">
            세아특수강
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-snug text-white">
            전자구매시스템
          </h2>
          <p className="text-sm leading-relaxed text-white/60">
            세아특수강의 전자구매 포털에 오신 것을 환영합니다.
            <br />
            사번과 비밀번호로 로그인하세요.
          </p>

          {/* Feature badges */}
          <div className="mt-10 flex flex-col gap-3 w-full">
            {[
              { label: '거래명세서', desc: '전자 거래 내역 조회' },
              { label: '반·출입 & 이송', desc: '물자 현황 실시간 관리' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-left"
              >
                <div className="size-2 shrink-0 rounded-full bg-seah-orange-400" />
                <div>
                  <div className="text-sm font-semibold text-white">{f.label}</div>
                  <div className="text-xs text-white/50">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="absolute bottom-6 text-xs text-white/30">
          © SeAH Special Steel Corp. All rights reserved.
        </p>
      </div>

      {/* ── Right Login Form ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:px-12 xl:px-20">
        {/* Background decoration (mobile only) */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden lg:hidden">
          <div className="absolute -top-[20%] -right-[10%] size-[500px] rounded-full bg-[#E94E1B]/5 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] size-80 rounded-full bg-slate-200/40 blur-3xl" />
        </div>

        <div className="w-full max-w-sm">
          {/* Card wrapper — only on mobile */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm lg:border-0 lg:shadow-none">
            {/* Top accent bar (mobile only) */}
            <div className="h-1.5 w-full bg-seah-orange-500 lg:hidden" />

            <div className="px-6 py-10 sm:px-8 lg:px-0">
              {/* Logo section */}
              <div className="mb-10 flex flex-col items-center">
                <div className="mb-5 h-10 w-auto">
                  <img
                    src="/seahsp_ci.png"
                    alt="SeAH Special Steel"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 lg:hidden">
                  전자구매시스템
                </h1>
                <p className="mt-1.5 text-center text-sm text-slate-500 lg:hidden">
                  사번과 비밀번호로 로그인하세요
                </p>
                {/* Desktop heading */}
                <p className="hidden text-center text-sm text-slate-500 lg:block">
                  사번과 비밀번호로 로그인하세요
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* User ID */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="loginId"
                    className="block text-sm font-medium text-[#53565A]"
                  >
                    아이디 (사번)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="size-5 text-slate-400"
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
                      className="block w-full rounded-lg border-0 bg-slate-50 py-3.5 pl-10 text-slate-900
                                 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400
                                 focus:ring-2 focus:ring-inset focus:ring-[#E94E1B]
                                 disabled:bg-slate-100 disabled:text-slate-400
                                 text-sm leading-6 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#53565A]"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="size-5 text-slate-400"
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
                      className="block w-full rounded-lg border-0 bg-slate-50 py-3.5 pl-10 pr-10 text-slate-900
                                 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400
                                 focus:ring-2 focus:ring-inset focus:ring-[#E94E1B]
                                 disabled:bg-slate-100 disabled:text-slate-400
                                 text-sm leading-6 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                      tabIndex={-1}
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showPassword ? (
                        <svg
                          className="size-5 text-slate-400 transition-colors hover:text-[#E94E1B]"
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
                          className="size-5 text-slate-400 transition-colors hover:text-[#E94E1B]"
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

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-slate-300 bg-slate-50 text-[#E94E1B] focus:ring-[#E94E1B]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#53565A]">
                    아이디 저장
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg bg-[#E94E1B] px-3 py-3.5
                             text-sm font-semibold leading-6 text-white shadow-sm
                             hover:bg-[#D14518] focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-[#E94E1B]
                             disabled:cursor-not-allowed disabled:bg-slate-300
                             transition-all duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                    </span>
                  ) : (
                    '로그인'
                  )}
                </button>
              </form>
            </div>

            {/* Footer — mobile only */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 lg:hidden">
              <p className="text-center text-xs text-slate-400">
                © SeAH Special Steel Corp. All rights reserved.
              </p>
            </div>
          </div>

          {/* Desktop copyright */}
          <p className="mt-8 hidden text-center text-xs text-slate-400 lg:block">
            © SeAH Special Steel Corp. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Login Failure Popup ───────────────────────────── */}
      {errorPopup !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-[2px]">
          <div className="flex w-full max-w-sm flex-col gap-6 overflow-hidden rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50">
                <svg
                  className="size-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[15px] font-medium leading-relaxed text-[#53565A]">
                  {errorPopup}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorPopup(null)}
                className="rounded-lg bg-[#E94E1B] px-8 py-2.5 text-sm font-semibold text-white
                           shadow-sm transition-colors hover:bg-[#D14518] active:scale-95"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
