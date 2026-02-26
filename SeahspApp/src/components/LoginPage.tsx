import { useState, useEffect, type FormEvent } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

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
    if (rememberMe) {
      localStorage.setItem(SAVED_ID_KEY, loginId);
      localStorage.setItem(SAVED_REMEMBER_KEY, 'true');
    } else {
      localStorage.removeItem(SAVED_ID_KEY);
      localStorage.removeItem(SAVED_REMEMBER_KEY);
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`로그인 시도: ${loginId}`);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#F8FAFC] px-6 py-10 font-sans">
      {/* Background Atmosphere - Light Version */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #E94E1B 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[0%] -left-[10%] h-[500px] w-[500px] rounded-full blur-[100px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #53565A 0%, transparent 70%)' }}
        />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
          {/* Top Orange Bar */}
          <div className="h-1.5 w-full bg-seah-orange-500" />

          <div className="px-8 pt-12 pb-10 sm:px-12">
            {/* Header Area */}
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="mb-6 h-12">
                <img
                  src="/seah_ci.png"
                  alt="SeAH Logo"
                  className="h-full w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-seah-gray-900 sm:text-3xl">
                세아 ePro 시스템
              </h1>
              <p className="mt-2 text-sm font-medium text-seah-gray-500">
                인증된 사용자만 접근할 수 있는 페이지입니다.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID Input */}
              <div className="space-y-2">
                <label htmlFor="loginId" className="block text-[13px] font-bold text-seah-gray-700">
                  아이디
                </label>
                <div className={`relative flex items-center transition-all duration-300 ${idFocused ? 'ring-2 ring-seah-orange-500/10' : ''
                  }`}>
                  <div className="absolute left-4 z-10 text-seah-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="loginId"
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    onFocus={() => setIdFocused(true)}
                    onBlur={() => setIdFocused(false)}
                    placeholder="아이디를 입력하세요"
                    className={`h-12 w-full rounded-xl border-[1.5px] pl-11 pr-4 text-[15px] font-medium transition-all duration-200 focus:outline-none ${idFocused ? 'border-seah-orange-500' : 'border-seah-gray-200 hover:border-seah-gray-300'
                      }`}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-[13px] font-bold text-seah-gray-700">
                  비밀번호
                </label>
                <div className={`relative flex items-center transition-all duration-300 ${pwFocused ? 'ring-2 ring-seah-orange-500/10' : ''
                  }`}>
                  <div className="absolute left-4 z-10 text-seah-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                    placeholder="비밀번호를 입력하세요"
                    className={`h-12 w-full rounded-xl border-[1.5px] pl-11 pr-12 text-[15px] font-medium transition-all duration-200 focus:outline-none ${pwFocused ? 'border-seah-orange-500' : 'border-seah-gray-200 hover:border-seah-gray-300'
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-seah-gray-400 hover:text-seah-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between px-0.5">
                <label className="flex cursor-pointer items-center gap-2 group">
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="peer h-full w-full cursor-pointer appearance-none rounded-md border-[1.5px] border-seah-gray-300 transition-all checked:border-seah-orange-500 checked:bg-seah-orange-500"
                    />
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    >
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-seah-gray-500 group-hover:text-seah-gray-700">아이디 저장</span>
                </label>
                <button type="button" className="text-sm font-bold text-seah-orange-500 hover:text-seah-orange-600 transition-colors">
                  비밀번호 찾기
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !loginId || !password}
                className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-seah-orange-500 text-[16px] font-bold text-white transition-all duration-300 hover:bg-seah-orange-600 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
                ) : (
                  <span>로그인</span>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer Area */}
          <div className="border-t border-seah-gray-100 bg-[#F8FAFC] px-8 py-6 text-center sm:px-12">
            <p className="text-[11px] font-medium text-seah-gray-400">
              &copy; {new Date().getFullYear()} SeAH Special Steel Corp. All rights reserved.
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-bold text-seah-gray-500">
              <button className="hover:text-seah-orange-500 transition-colors">개인정보처리방침</button>
              <button className="hover:text-seah-orange-500 transition-colors">이용약관</button>
              <button className="hover:text-seah-orange-500 transition-colors">고객지원</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
