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

const MENU_ITEMS = [
  {
    icon: FileText,
    title: '거래명세서',
    subtitle: 'Transaction Statements',
    description: '거래 내역 및 명세서를 조회합니다',
  },
  {
    icon: Truck,
    title: '반·출입 & 이송',
    subtitle: 'In/Outbound & Transfer',
    description: '물자 반입·출입 및 이송 현황을 관리합니다',
  },
];

const SIDEBAR_NAV = [
  { icon: Home, label: '홈', active: true },
  { icon: FileText, label: '거래명세서', active: false },
  { icon: Truck, label: '반·출입 & 이송', active: false },
];

export function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-dvh bg-[#F8F9FA]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-seah-gray-500 shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo + User */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center text-white">
              <Layers size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold uppercase leading-none tracking-tight">
                <span className="text-seah-orange-500">세아특수강</span>
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-xs font-bold text-white">{user?.userName ?? ''}</span>
                <span className="text-[10px] font-normal text-white/50">
                  ({user?.loginId})
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="로그아웃"
          >
            <LogOut size={18} />
            <span className="hidden text-sm font-medium md:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-4 pb-28 pt-6 md:px-6 md:pb-10 lg:flex lg:gap-8 lg:px-8 lg:pt-8">

        {/* ── Sidebar (desktop only) ─────────────────────── */}
        <aside className="hidden lg:block lg:w-60 xl:w-64 shrink-0">
          <div className="sticky top-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* User info */}
            <div className="bg-seah-gray-500 px-5 py-6 text-white">
              <div className="mb-1 text-base font-bold leading-tight">
                {user?.userName ?? ''}
              </div>
              <div className="text-xs text-white/50">{user?.loginId}</div>
              <div className="mt-3 inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                사용자
              </div>
            </div>

            {/* Nav links */}
            <nav className="p-2">
              {SIDEBAR_NAV.map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    active
                      ? 'bg-seah-orange-500/8 font-semibold text-seah-orange-500'
                      : 'text-seah-gray-500 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>


          </div>
        </aside>

        {/* ── Main content ───────────────────────────────── */}
        <main className="min-w-0 flex-1 space-y-4 lg:space-y-5">
          {/* Notice Banner */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-seah-orange-500">
                <Megaphone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-bold uppercase tracking-tight text-seah-orange-500">
                    Notice
                  </span>
                  <p className="truncate text-sm font-medium text-seah-gray-500">
                    [안내] 2024년 하반기 시스템 점검 안내
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-slate-300" />
            </div>
          </div>

          {/* Section heading (desktop) */}
          <div className="hidden lg:block">
            <h2 className="text-base font-bold text-seah-gray-500">메인 메뉴</h2>
            <p className="mt-0.5 text-xs text-slate-400">이용할 서비스를 선택하세요</p>
          </div>

          {/* Menu Cards — 1 col on mobile, 2 col on sm+ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.title}
                className="group flex w-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-seah-orange-200 hover:shadow-md active:scale-[0.98] active:bg-slate-50 lg:p-6"
              >
                {/* Icon */}
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-colors group-hover:border-seah-orange-100 group-hover:bg-seah-orange-50">
                  <item.icon size={28} className="text-seah-orange-500" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold leading-tight text-seah-gray-500 md:text-lg">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {item.subtitle}
                </p>

                {/* Description — desktop only */}
                <p className="mt-2 hidden text-xs leading-relaxed text-slate-400 sm:block">
                  {item.description}
                </p>

                {/* CTA */}
                <div className="mt-4 flex items-center gap-0.5 text-xs font-semibold text-seah-orange-500">
                  <span>바로가기</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* ── Background Watermark ─────────────────────────── */}
      <div className="pointer-events-none fixed bottom-24 right-0 select-none p-6 opacity-[0.03] md:bottom-6">
        <Factory size={140} className="text-seah-gray-500" />
      </div>

      {/* ── Bottom Navigation (mobile only) ─────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white lg:hidden">
        <div className="flex justify-center pb-2 pt-2">
          <button className="flex flex-col items-center gap-1 px-8 py-2 text-seah-orange-500">
            <Home size={24} strokeWidth={2} fill="currentColor" />
            <span className="text-[10px] font-bold">홈</span>
          </button>
        </div>
        <div className="flex justify-center pb-2">
          <div className="h-1 w-32 rounded-full bg-slate-200" />
        </div>
      </nav>
    </div>
  );
}
