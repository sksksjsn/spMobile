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
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 bg-white">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#E94E1B]/5 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      {/* Main Card */}
      <main className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-[#E94E1B]" />

        <div className="px-6 py-10 sm:px-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-6">
              <div className="h-12 w-auto flex items-center justify-center">
                <img
                  src="/seahsp_ci.png"
                  alt="SeAH Special Steel"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="text-slate-900 tracking-tight text-2xl font-bold leading-tight text-center">
              전자구매시스템
            </h1>
            <p className="text-slate-500 text-sm font-normal leading-normal mt-2 text-center">
              사번과 비밀번호로 로그인하세요
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* User ID Field */}
            <div className="space-y-2">
              <label
                htmlFor="loginId"
                className="block text-sm font-medium leading-6 text-[#53565A]"
              >
                아이디 (사번)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-slate-400"
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
                  className="block w-full rounded-lg border-0 py-3.5 pl-10 text-slate-900
                             ring-1 ring-inset ring-slate-300 placeholder:text-slate-400
                             focus:ring-2 focus:ring-inset focus:ring-[#E94E1B]
                             sm:text-sm sm:leading-6 bg-slate-50
                             disabled:bg-slate-100 disabled:text-slate-400
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-[#53565A]"
              >
                비밀번호
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-slate-400"
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
                  className="block w-full rounded-lg border-0 py-3.5 pl-10 pr-10 text-slate-900
                             ring-1 ring-inset ring-slate-300 placeholder:text-slate-400
                             focus:ring-2 focus:ring-inset focus:ring-[#E94E1B]
                             sm:text-sm sm:leading-6 bg-slate-50
                             disabled:bg-slate-100 disabled:text-slate-400
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-slate-400 hover:text-[#E94E1B] transition-colors"
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
                      className="w-5 h-5 text-slate-400 hover:text-[#E94E1B] transition-colors"
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
                className="h-4 w-4 rounded border-slate-300 text-[#E94E1B] focus:ring-[#E94E1B] bg-slate-50"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[#53565A]"
              >
                아이디 저장
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-[#E94E1B] px-3 py-3.5
                           text-sm font-semibold leading-6 text-white shadow-sm
                           hover:bg-orange-600 focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-[#E94E1B]
                           disabled:bg-slate-300 disabled:cursor-not-allowed
                           transition-all duration-200 active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
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
                  </span>
                ) : (
                  '로그인'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer / System Info */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
          <div className="flex items-center justify-center text-center">
            <p className="text-xs text-slate-400">
              © SeAH Special Steel Corp. All rights reserved.
            </p>
          </div>
        </div>
      </main>

      {/* Login Failure Popup */}
      {errorPopup !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[15px] text-[#53565A] font-medium leading-relaxed">
                  {errorPopup}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorPopup(null)}
                className="bg-[#E94E1B] text-white px-8 py-2.5 rounded-lg text-sm font-semibold
                           hover:bg-[#D14518] transition-colors shadow-sm active:scale-95"
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
