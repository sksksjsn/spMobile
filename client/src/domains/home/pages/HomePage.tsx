import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Factory,
  FileText,
  Home,
  Layers,
  LogOut,
  Megaphone,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';

export function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F8F9FA]">
      {/* Header */}
      <header className="flex items-center bg-seah-gray-500 px-4 py-3 justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="text-white flex size-7 shrink-0 items-center justify-center">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight uppercase leading-none">
              <span className="text-seah-orange-500">세아특수강</span>
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs font-bold text-white">{user?.userName ?? ''}</span>
              <span className="text-[10px] text-[#D1D3D4] font-normal">
                ({user?.loginId})
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-full h-9 w-9 hover:bg-white/10 transition-colors"
          aria-label="로그아웃"
        >
          <LogOut size={20} className="text-white" />
        </button>
      </header>

      {/* Notice Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="text-seah-orange-500 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 shrink-0 size-9">
            <Megaphone size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-seah-orange-500 shrink-0 uppercase tracking-tighter">
                Notice
              </span>
              <p className="text-seah-gray-500 text-sm font-medium truncate">
                [안내] 2024년 하반기 시스템 점검 안내
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-300 shrink-0" />
        </div>
      </div>

      {/* Main Menu Cards */}
      <main className="flex-1 px-4 py-6 space-y-4">
        {/* 거래명세서 */}
        <button className="w-full flex items-center bg-white border border-slate-200 rounded-xl p-5 shadow-sm active:bg-slate-50 active:scale-[0.98] transition-all text-left group">
          <div className="size-14 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-active:bg-white transition-colors">
            <FileText size={30} className="text-seah-orange-500" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-seah-gray-500 text-lg font-bold leading-tight">거래명세서</h3>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              Transaction Statements
            </p>
          </div>
          <ChevronRight size={20} className="text-seah-gray-300" />
        </button>

        {/* 반·출입 & 이송 */}
        <button className="w-full flex items-center bg-white border border-slate-200 rounded-xl p-5 shadow-sm active:bg-slate-50 active:scale-[0.98] transition-all text-left group">
          <div className="size-14 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-active:bg-white transition-colors">
            <Truck size={30} className="text-seah-orange-500" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-seah-gray-500 text-lg font-bold leading-tight">반·출입 &amp; 이송</h3>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              In/Outbound &amp; Transfer
            </p>
          </div>
          <ChevronRight size={20} className="text-seah-gray-300" />
        </button>
      </main>

      {/* Background Watermark */}
      <div className="fixed bottom-24 right-0 p-6 opacity-[0.03] pointer-events-none select-none">
        <Factory size={140} className="text-seah-gray-500" />
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t border-slate-200 pb-8 pt-2">
        <div className="flex justify-center items-center">
          <button className="flex flex-col items-center gap-1 px-8 py-2 text-seah-orange-500">
            <Home size={24} strokeWidth={2} fill="currentColor" />
            <span className="text-[10px] font-bold">홈</span>
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-slate-200 rounded-full" />
        </div>
      </nav>
    </div>
  );
}
