import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Factory,
  FileText,
  Home,
  Layers,
  LogOut,
  Megaphone,
  RotateCcw,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { LogisticsItem, LogisticsSearchParams } from '../types';

// ─── Mock data ───────────────────────────────────────────────────
const MOCK_COMPLETED: LogisticsItem[] = [
  {
    docNo: 'P20250210012',
    outSite: '포항',
    inSite: '본사',
    department: '설비팀(포항)',
    manager: '김경호',
    company: '(주)신화금속',
    material: '드럼',
    quantity: 3,
    unit: '개',
    securityCheck: 'Y',
    receiverCheck: 'Y',
    status: '반출',
    regDt: '2025-02-10T10:00:00',
  },
  {
    docNo: 'P20250205007',
    outSite: '창원',
    inSite: '군산',
    department: '생산팀(창원)',
    manager: '이민수',
    company: '현대제철',
    material: '강판',
    quantity: 5,
    unit: '장',
    securityCheck: 'Y',
    receiverCheck: 'Y',
    status: '반입',
    regDt: '2025-02-05T14:30:00',
  },
  {
    docNo: 'P20250201003',
    outSite: '본사',
    inSite: '포항',
    department: '자재팀(본사)',
    manager: '박지영',
    company: '삼성중공업',
    material: '볼트/너트',
    quantity: 200,
    unit: '세트',
    securityCheck: 'Y',
    receiverCheck: 'Y',
    status: '반출',
    regDt: '2025-02-01T09:15:00',
  },
];

const SITES = ['전체', '본사', '포항', '창원', '군산'];
const DATE_QUICK = ['전체', '1일', '1주', '1개월', '1년'] as const;
type DateQuick = (typeof DATE_QUICK)[number];

const SIDEBAR_NAV = [
  { icon: Home, label: '홈', active: false, path: '/' },
  { icon: Megaphone, label: '공지사항', active: false, path: '/notice' },
  { icon: FileText, label: '거래명세서', active: false, path: null },
  { icon: Truck, label: '반·출입 & 이송', active: true, path: '/logistics' },
];

function formatDate(dt: string): string {
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

function CompletedCard({ item }: { item: LogisticsItem }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top row */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-bold tracking-tight text-seah-gray-500">
          {item.docNo}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
            완료
          </span>
        </div>
      </div>

      {/* Sites */}
      <div className="mb-2 flex items-center gap-1.5 text-sm text-slate-600">
        <span className="font-medium">{item.outSite}</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium">{item.inSite}</span>
      </div>

      {/* Dept / Manager */}
      <div className="mb-2 text-xs text-slate-500">
        {item.department} / {item.manager}
      </div>

      {/* Company */}
      <div className="mb-3 text-xs font-medium text-slate-500">{item.company}</div>

      {/* Material */}
      <div className="mb-3 text-sm font-semibold text-seah-gray-500">
        {item.material}{' '}
        <span className="font-normal text-slate-500">
          {item.quantity}
          {item.unit}
        </span>
      </div>

      {/* Bottom row */}
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

export function LogisticsCompletedPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(true);
  const [outSite, setOutSite] = useState('전체');
  const [inSite, setInSite] = useState('전체');
  const [company, setCompany] = useState('');
  const [material, setMaterial] = useState('');
  const [dateQuick, setDateQuick] = useState<DateQuick>('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState<LogisticsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildParams(): LogisticsSearchParams {
    return {
      outSite: outSite !== '전체' ? outSite : undefined,
      inSite: inSite !== '전체' ? inSite : undefined,
      company: company || undefined,
      material: material || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
  }

  function handleSearch() {
    setLoading(true);
    setTimeout(() => {
      const p = buildParams();
      const filtered = MOCK_COMPLETED.filter((item) => {
        if (p.outSite && item.outSite !== p.outSite) return false;
        if (p.inSite && item.inSite !== p.inSite) return false;
        if (p.company && !item.company.includes(p.company)) return false;
        if (p.material && !item.material.includes(p.material)) return false;
        return true;
      });
      setItems(filtered);
      setLoading(false);
    }, 300);
  }

  function handleReset() {
    setOutSite('전체');
    setInSite('전체');
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
                onClick={() => navigate('/logistics')}
                className="flex size-8 items-center justify-center rounded-lg text-seah-gray-500 transition-colors hover:bg-slate-200"
                aria-label="반출입 목록으로"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <h1 className="text-lg font-bold text-seah-gray-500">반출입 완료 목록</h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/logistics')}
              className="flex items-center gap-1 text-sm font-medium text-seah-gray-500 underline-offset-2 hover:underline"
            >
              반출입 목록
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
                {/* Sites */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      반출사업장
                    </label>
                    <select
                      value={outSite}
                      onChange={(e) => setOutSite(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    >
                      {SITES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                      반입사업장
                    </label>
                    <select
                      value={inSite}
                      onChange={(e) => setInSite(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400"
                    >
                      {SITES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Company + Material */}
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

                {/* Period */}
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">기간</label>
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

          {/* Result count */}
          <div className="px-1">
            <p className="text-xs font-medium text-slate-500">
              총 <span className="font-bold text-seah-orange-500">{items.length}</span>건
            </p>
          </div>

          {/* List */}
          {loading && (
            <div className="py-16 text-center text-sm text-slate-400">불러오는 중...</div>
          )}
          {!loading && items.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400 shadow-sm">
              검색 결과가 없습니다.
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {items.map((item) => (
                <CompletedCard key={item.docNo} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Background Watermark */}
      <div className="pointer-events-none fixed bottom-24 right-0 select-none p-6 opacity-[0.03] md:bottom-6">
        <Factory size={140} className="text-seah-gray-500" />
      </div>

      {/* Bottom Navigation (mobile only) */}
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
