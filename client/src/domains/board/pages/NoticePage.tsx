import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Factory,
  FileText,
  Home,
  Layers,
  LogOut,
  Megaphone,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import { boardApi } from '../api';
import type { Notice } from '../types';

const SIDEBAR_NAV = [
  { icon: Home, label: '홈', active: false, path: '/' },
  { icon: Megaphone, label: '공지사항', active: true, path: '/notice' },
  { icon: FileText, label: '거래명세서', active: false, path: null },
  { icon: Truck, label: '반·출입 & 이송', active: false, path: null },
];

function formatDate(regDt: string | null): string {
  if (!regDt) return '';
  const d = new Date(regDt);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function isNew(regDt: string | null): boolean {
  if (!regDt) return false;
  const d = new Date(regDt);
  if (isNaN(d.getTime())) return false;
  const diffMs = Date.now() - d.getTime();
  return diffMs < 7 * 24 * 60 * 60 * 1000;
}

export function NoticePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeq, setExpandedSeq] = useState<string | null>(null);

  useEffect(() => {
    boardApi
      .getNotices()
      .then((res) => setNotices(res.notices))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleExpand = (seq: string | null) => {
    setExpandedSeq((prev) => (prev === seq ? null : seq));
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
              {SIDEBAR_NAV.map(({ icon: Icon, label, active, path }) => (
                <button
                  key={label}
                  onClick={() => path && navigate(path)}
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
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Page Title */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
              <Megaphone size={20} className="text-seah-orange-500" />
              <h2 className="text-lg font-bold text-seah-gray-500">공지사항</h2>
            </div>

            {/* Notice List */}
            <div className="flex flex-col">
              {loading && (
                <div className="py-16 text-center text-sm text-slate-400">불러오는 중...</div>
              )}

              {!loading && notices.length === 0 && (
                <div className="py-16 text-center text-sm text-slate-400">공지사항이 없습니다.</div>
              )}

              {!loading &&
                notices.map((notice) => {
                  const key = notice.boardSeq ?? notice.boardTitle ?? '';
                  const expanded = expandedSeq === key;

                  return (
                    <div
                      key={key}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      {/* 제목 행 (클릭 시 내용 토글) */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(key)}
                        className="flex w-full cursor-pointer items-start justify-between px-4 py-5 text-left transition-colors hover:bg-slate-50 active:bg-slate-50"
                      >
                        <div className="flex flex-col gap-1 pr-4">
                          <div className="flex items-center gap-2">
                            {notice.importYn === 'Y' && (
                              <span className="shrink-0 rounded-sm bg-seah-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                중요
                              </span>
                            )}
                            <h3 className="text-[15px] font-bold leading-snug text-seah-gray-500">
                              {notice.boardTitle ?? '(제목 없음)'}
                            </h3>
                            {isNew(notice.regDt) && (
                              <span className="shrink-0 rounded-sm bg-seah-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold text-seah-orange-500">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{formatDate(notice.regDt)}</span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={[
                            'mt-0.5 shrink-0 text-slate-400 transition-transform duration-200',
                            expanded ? 'rotate-180' : '',
                          ].join(' ')}
                        />
                      </button>

                      {/* 내용 (아코디언) */}
                      {expanded && (
                        <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                            {notice.boardTxt ?? '내용이 없습니다.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
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
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 px-8 py-2 text-seah-orange-500"
          >
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
