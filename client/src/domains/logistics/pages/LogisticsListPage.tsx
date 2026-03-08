import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Factory,
  Home,
  Layers,
  LogOut,
  Megaphone,
  FileText,
  Plus,
  RotateCcw,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { LogisticsItem, LogisticsSearchParams } from '../types';
import { logisticsApi } from '../api';
import { useSitesDept } from '@/core/hooks/useSitesDept';

const SIDEBAR_NAV = [
  { icon: Home, label: '홈', active: false, path: '/' },
  { icon: Megaphone, label: '공지사항', active: false, path: '/notice' },
  { icon: FileText, label: '거래명세서', active: false, path: null },
  { icon: Truck, label: '반·출입 & 이송', active: true, path: '/logistics' },
];

const DATE_QUICK = ['전체', '1일', '1주', '1개월', '1년'] as const;
type DateQuick = (typeof DATE_QUICK)[number];

function formatDate(dt: string | null): string {
  if (!dt) return '';
  const d = new Date(dt);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function toInputDate(dt: string): string {
  const d = new Date(dt);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getQuickDates(quick: DateQuick): { start: string; end: string } | null {
  if (quick === '전체') return null;
  const now = new Date();
  const end = toInputDate(now.toISOString());
  const start = new Date(now);
  if (quick === '1일') start.setDate(now.getDate() - 1);
  else if (quick === '1주') start.setDate(now.getDate() - 7);
  else if (quick === '1개월') start.setMonth(now.getMonth() - 1);
  else if (quick === '1년') start.setFullYear(now.getFullYear() - 1);
  return { start: toInputDate(start.toISOString()), end };
}

// ─── Sub-components ──────────────────────────────────────────────

function CheckIcon({ value }: { value: 'Y' | 'N' }) {
  return value === 'Y' ? (
    <CheckCircle2 size={16} className="text-emerald-500" />
  ) : (
    <XCircle size={16} className="text-rose-400" />
  );
}

function StatusBadge({ status }: { status: '반입' | '반출' }) {
  return status === '반입' ? (
    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-600">
      반입
    </span>
  ) : (
    <span className="rounded-full bg-seah-orange-500/10 px-2.5 py-0.5 text-[11px] font-bold text-seah-orange-500">
      반출
    </span>
  );
}

function LogisticsCard({ item }: { item: LogisticsItem }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md active:bg-slate-50">
      {/* Top row: docNo + status */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-bold tracking-tight text-seah-gray-500">
          {item.docNo}
        </span>
        <StatusBadge status={item.status} />
      </div>

      {/* Site row */}
      <div className="mb-2 flex items-center gap-1.5 text-sm text-slate-600">
        <span className="font-medium">{item.outSiteName || item.outSite}</span>
      </div>

      {/* Dept / Manager */}
      <div className="mb-2 text-xs text-slate-500">
        {item.department}
        {item.manager && ` / ${item.manager}`}
      </div>

      {/* Company */}
      {item.company && (
        <div className="mb-3 text-xs font-medium text-slate-500">{item.company}</div>
      )}

      {/* Material */}
      {item.material && (
        <div className="mb-3 text-sm font-semibold text-seah-gray-500">
          {item.material}{' '}
          {item.quantity != null && (
            <span className="font-normal text-slate-500">
              {item.quantity}
              {item.unit ?? ''}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: checks + date */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400">경비실</span>
            <CheckIcon value={item.securityCheck} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400">인수자</span>
            <CheckIcon value={item.receiverCheck} />
          </div>
        </div>
        <span className="text-[11px] text-slate-400">{formatDate(item.regDt)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export function LogisticsListPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // FAB state
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const { sites, getDeptsBySite } = useSitesDept();

  useEffect(() => {
    if (!fabOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fabOpen]);

  // Search state
  const [filterOpen, setFilterOpen] = useState(true);
  const [outSite, setOutSite] = useState('');
  const [outDept, setOutDept] = useState('');
  const [inSite, setInSite] = useState('');
  const [company, setCompany] = useState('');
  const [material, setMaterial] = useState('');
  const [dateQuick, setDateQuick] = useState<DateQuick>('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data state
  const [items, setItems] = useState<LogisticsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildParams(): LogisticsSearchParams {
    return {
      outSite: outSite || undefined,
      outDept: outDept || undefined,
      inSite: inSite || undefined,
      company: company || undefined,
      material: material || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
  }

  async function handleSearch() {
    setLoading(true);
    setError(null);
    try {
      const res = await logisticsApi.getList(buildParams());
      setItems(res.items);
    } catch {
      setError('목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setOutSite('');
    setOutDept('');
    setInSite('');
    setCompany('');
    setMaterial('');
    setDateQuick('전체');
    setStartDate('');
    setEndDate('');
  }

  function handleDateQuick(q: DateQuick) {
    setDateQuick(q);
    const range = getQuickDates(q);
    if (range) {
      setStartDate(range.start);
      setEndDate(range.end);
    } else {
      setStartDate('');
      setEndDate('');
    }
  }

  function handleOutSiteChange(val: string) {
    setOutSite(val);
    setOutDept('');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="relative min-h-dvh bg-[#F8F9FA]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-seah-gray-500 shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-6">
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
                <span className="text-[10px] font-normal text-white/50">({user?.loginId})</span>
              </div>
            </div>
          </div>
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
            <div className="bg-seah-gray-500 px-5 py-6 text-white">
              <div className="mb-1 text-base font-bold leading-tight">{user?.userName ?? ''}</div>
              <div className="text-xs text-white/50">{user?.loginId}</div>
              <div className="mt-3 inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                사용자
              </div>
            </div>
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
        <main className="min-w-0 flex-1 space-y-4">

          {/* Page Title bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex size-8 items-center justify-center rounded-lg text-seah-gray-500 transition-colors hover:bg-slate-200"
                aria-label="홈으로"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <Truck size={20} className="text-seah-orange-500" />
                <h1 className="text-lg font-bold text-seah-gray-500">반출입 목록</h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/logistics/completed')}
              className="flex items-center gap-1 text-sm font-medium text-seah-orange-500 underline-offset-2 hover:underline"
            >
              반출입 완료 목록
              <ChevronRight size={14} />
            </button>
          </div>

          {/* ── Search Filter ──────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-seah-orange-500" />
                <span className="text-sm font-bold text-seah-gray-500">조건검색</span>
              </div>
              <ChevronDown
                size={16}
                className={[
                  'text-slate-400 transition-transform duration-200',
                  filterOpen ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>

            {filterOpen && (
              <div className="border-t border-slate-100 px-4 pb-4 pt-4">
                {/* Row 1: Sites + Dept */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* 반출사업장 */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      반출사업장
                    </label>
                    <select
                      value={outSite}
                      onChange={(e) => handleOutSiteChange(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    >
                      <option value="">전체</option>
                      {sites.map((s) => (
                        <option key={s.busiPlace} value={s.busiPlace}>
                          {s.busiPlaceName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 반출부서 */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      반출부서
                    </label>
                    <select
                      value={outDept}
                      onChange={(e) => setOutDept(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    >
                      <option value="">전체</option>
                      {getDeptsBySite(outSite).map((d) => (
                        <option key={d.deptCode} value={d.deptCode}>
                          {d.deptName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 반입사업장 */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      반입사업장
                    </label>
                    <select
                      value={inSite}
                      onChange={(e) => setInSite(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    >
                      <option value="">전체</option>
                      {sites.map((s) => (
                        <option key={s.busiPlace} value={s.busiPlace}>
                          {s.busiPlaceName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Company + Material */}
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      업체명
                    </label>
                    <input
                      type="text"
                      placeholder="업체명 검색"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      자재명
                    </label>
                    <input
                      type="text"
                      placeholder="자재명 검색"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    />
                  </div>
                </div>

                {/* Row 3: Period */}
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">기간</label>

                  {/* Quick buttons */}
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {DATE_QUICK.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleDateQuick(q)}
                        className={[
                          'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                          dateQuick === q
                            ? 'bg-seah-orange-500 text-white'
                            : 'border border-slate-200 bg-white text-seah-gray-500 hover:border-seah-orange-300 hover:text-seah-orange-500',
                        ].join(' ')}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Date range */}
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setDateQuick('전체');
                      }}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    />
                    <span className="text-xs text-slate-400">~</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setDateQuick('전체');
                      }}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-seah-gray-500 transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw size={14} />
                    조건초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 rounded-lg bg-seah-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-seah-orange-600"
                  >
                    <Search size={14} />
                    검색
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Result count ────────────────────────────── */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500">
              총 <span className="font-bold text-seah-orange-500">{items.length}</span>건
            </p>
          </div>

          {/* ── List ────────────────────────────────────── */}
          {loading && (
            <div className="py-16 text-center text-sm text-slate-400">불러오는 중...</div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 py-8 text-center text-sm text-rose-500 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400 shadow-sm">
              검색 결과가 없습니다.
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {items.map((item) => (
                <LogisticsCard key={item.docNo} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Background Watermark ─────────────────────────── */}
      <div className="pointer-events-none fixed bottom-24 right-0 select-none p-6 opacity-[0.03] md:bottom-6">
        <Factory size={140} className="text-seah-gray-500" />
      </div>

      {/* ── FAB Backdrop ─────────────────────────────────── */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setFabOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── FAB Group ────────────────────────────────────── */}
      <div
        ref={fabRef}
        className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 lg:bottom-8"
      >
        {/* Sub-buttons */}
        {fabOpen && (
          <>
            {/* 반출 등록 */}
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-seah-gray-500 shadow-md">
                반출
              </span>
              <button
                onClick={() => {
                  setFabOpen(false);
                  navigate('/logistics/register/export');
                }}
                className="flex size-12 items-center justify-center rounded-full bg-seah-orange-500 shadow-md transition-all hover:bg-seah-orange-600 active:scale-95"
                aria-label="반출 등록"
              >
                <Truck size={20} className="text-white" />
              </button>
            </div>

            {/* 사업장이동 등록 */}
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-seah-gray-500 shadow-md">
                사업장이동
              </span>
              <button
                onClick={() => {
                  setFabOpen(false);
                  navigate('/logistics/register/transfer');
                }}
                className="flex size-12 items-center justify-center rounded-full bg-seah-gray-500 shadow-md transition-all hover:bg-seah-gray-600 active:scale-95"
                aria-label="사업장이동 등록"
              >
                <Building2 size={20} className="text-white" />
              </button>
            </div>
          </>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className={[
            'flex size-14 items-center justify-center rounded-full bg-seah-orange-500 shadow-lg transition-all hover:bg-seah-orange-600 hover:shadow-xl active:scale-95',
            fabOpen ? 'rotate-45' : '',
          ].join(' ')}
          aria-label="등록 메뉴 열기"
        >
          <Plus size={26} className="text-white" />
        </button>
      </div>

      {/* ── Bottom Navigation (mobile only) ─────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white lg:hidden">
        <div className="flex justify-center pb-2 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 px-8 py-2 text-slate-400 transition-colors hover:text-seah-orange-500"
          >
            <Home size={24} strokeWidth={2} />
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
