import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Home,
  Layers,
  LogOut,
  Package,
  PenLine,
  Truck,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import { useSitesDept } from '@/core/hooks/useSitesDept';
import { useUnits } from '@/core/hooks/useUnits';
import { logisticsApi } from '../api';
import type { LogisticsDetail } from '../types';

type TabKey = '문서' | '물품' | '서명';
const TABS: TabKey[] = ['문서', '물품', '서명'];

// ─── 읽기 전용 필드 컴포넌트 ─────────────────────────────────────────────────
function ReadField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center border-b border-slate-100 py-3">
      <span className="w-32 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-seah-gray-500">
        {value || <span className="text-slate-300">-</span>}
      </div>
    </div>
  );
}

// ─── 경비실 / 인수자 서명 상태 카드 ──────────────────────────────────────────
function SignatureCard({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div
      className={[
        'flex flex-col items-center gap-3 rounded-xl border p-6',
        checked
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-white',
      ].join(' ')}
    >
      {checked ? (
        <CheckCircle2 size={40} className="text-emerald-500" />
      ) : (
        <XCircle size={40} className="text-rose-400" />
      )}
      <div className="text-center">
        <p className="text-sm font-bold text-seah-gray-500">{label}</p>
        <p
          className={[
            'mt-1 text-xs font-semibold',
            checked ? 'text-emerald-600' : 'text-rose-400',
          ].join(' ')}
        >
          {checked ? '확인 완료' : '미확인'}
        </p>
      </div>
    </div>
  );
}

// ─── 물품 아이템 카드 ─────────────────────────────────────────────────────────
function ItemCard({
  seq,
  itemName,
  itemSpec,
  maker,
  quantity,
  unitName,
  reason,
  note,
  photos,
}: {
  seq: number;
  docNo: string;
  itemName: string;
  itemSpec: string | null;
  maker: string | null;
  quantity: number | null;
  unitName: string | null;
  reason: string | null;
  note: string | null;
  photos: string[];
}) {
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between bg-gradient-to-r from-seah-orange-500 to-seah-orange-400 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white">
            {seq}
          </span>
          <span className="text-sm font-bold text-white">{itemName}</span>
        </div>
        {quantity != null && (
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-sm font-bold text-white">
            {quantity}
            <span className="ml-0.5 text-xs font-medium opacity-80">{unitName ?? ''}</span>
          </span>
        )}
      </div>

      {/* 상세 정보 그리드 */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-100">
        {[
          { label: '규격', value: itemSpec },
          { label: '메이커', value: maker },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="text-sm font-medium text-seah-gray-500">{value || '-'}</p>
          </div>
        ))}
      </div>

      {/* 반출사유 / 비고 */}
      <div className="divide-y divide-slate-100 px-4">
        {reason && (
          <div className="py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              반출사유
            </p>
            <p className="text-sm text-seah-gray-500">{reason}</p>
          </div>
        )}
        {note && (
          <div className="py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              비고
            </p>
            <p className="text-sm text-seah-gray-500">{note}</p>
          </div>
        )}
      </div>

      {/* 반출 사진 */}
      {photos.length > 0 && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            반출 사진
          </p>
          <div className="flex flex-wrap gap-2">
            {photos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhotoIdx(i)}
                className="size-18 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs transition-transform active:scale-95"
              >
                <img src={src} alt={`사진 ${i + 1}`} className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 사진 전체보기 모달 */}
      {photoIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPhotoIdx(null)}
        >
          <img
            src={photos[photoIdx]}
            alt={`사진 ${photoIdx + 1}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────
export function LogisticsDetailPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { docNo } = useParams<{ docNo: string }>();
  const { sites } = useSitesDept();
  const { units } = useUnits();
  const siteMap = Object.fromEntries(sites.map((s) => [s.busiPlace, s.busiPlaceName]));
  const unitMap = Object.fromEntries(units.map((u) => [u.unitCode, u.unitName]));

  const [activeTab, setActiveTab] = useState<TabKey>('문서');
  const [detail, setDetail] = useState<LogisticsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docNo) return;
    setLoading(true);
    setError(null);
    logisticsApi
      .getDetail(docNo)
      .then(setDetail)
      .catch(() => setError('상세 정보를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, [docNo]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  // 운송유형 레이블
  function transportLabel(type: string | null): string {
    if (type === '01') return '직납';
    if (type === '02') return '택배';
    return type ?? '-';
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
      <div className="mx-auto max-w-screen-md px-4 pb-28 pt-6 md:px-6">
        {/* Page Title */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => navigate('/logistics')}
            className="flex size-8 items-center justify-center rounded-lg text-seah-gray-500 transition-colors hover:bg-slate-200"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <Truck size={20} className="text-seah-orange-500" />
          <h1 className="text-lg font-bold text-seah-gray-500">반출증 상세보기</h1>
        </div>

        {/* ── Loading / Error ─────────────────────────────── */}
        {loading && (
          <div className="py-20 text-center text-sm text-slate-400">불러오는 중...</div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 py-10 text-center text-sm text-rose-500 shadow-sm">
            {error}
          </div>
        )}

        {/* ── Content ─────────────────────────────────────── */}
        {!loading && !error && detail && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Tab Bar */}
            <div className="flex border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'flex flex-1 items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors',
                    activeTab === tab
                      ? 'border-b-2 border-seah-orange-500 text-seah-orange-500'
                      : 'text-slate-400 hover:text-seah-gray-500',
                  ].join(' ')}
                >
                  {tab === '문서' && <FileText size={14} />}
                  {tab === '물품' && <Package size={14} />}
                  {tab === '서명' && <PenLine size={14} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* ── 문서 탭 ─────────────────────────────────── */}
            {activeTab === '문서' && (
              <div className="px-5 pb-5 pt-2">
                <ReadField label="반출입코드" value={detail.docNo} />
                <ReadField
                  label="반출 사업장"
                  value={siteMap[detail.busiPlace] ?? detail.busiPlace}
                />
                <ReadField
                  label="반출 일자"
                  value={detail.exportDate?.split('T')[0] ?? null}
                />
                <ReadField label="의뢰 담당자" value={detail.authorName} />
                <ReadField
                  label="운송유형"
                  value={transportLabel(detail.transportType)}
                />
                {detail.transportType === '01' && (
                  <>
                    <ReadField label="차량번호" value={detail.driverVehicleNo} />
                    <ReadField label="운전자 성명" value={detail.driverName} />
                    <ReadField label="운전자 연락처" value={detail.driverPhone} />
                  </>
                )}
                {detail.transportType === '02' && (
                  <>
                    <ReadField label="택배사" value={detail.courierName} />
                    <ReadField label="송장번호" value={detail.courierInvoiceNo} />
                  </>
                )}
                <ReadField label="업체명" value={detail.partnerCompany} />
                <ReadField label="인수 담당자" value={detail.receiverName} />
                <ReadField label="인수자 연락처" value={detail.receiverPhone} />
                <ReadField label="반출 사유" value={detail.items[0]?.reason ?? null} />
                <ReadField label="비고" value={detail.items[0]?.note ?? null} />
              </div>
            )}

            {/* ── 물품 탭 ─────────────────────────────────── */}
            {activeTab === '물품' && (
              <div className="p-4">
                {detail.items.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    등록된 물품이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detail.items.map((item) => (
                      <ItemCard
                        key={item.itemSeq}
                        seq={item.itemSeq}
                        docNo={detail.docNo}
                        itemName={item.itemName}
                        itemSpec={item.itemSpec}
                        maker={item.maker}
                        quantity={item.quantity}
                        unitName={item.unitCode ? (unitMap[item.unitCode] ?? item.unitCode) : null}
                        reason={item.reason}
                        note={item.note}
                        photos={item.photos}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 서명 탭 ─────────────────────────────────── */}
            {activeTab === '서명' && (
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <SignatureCard
                    label="경비실 확인"
                    checked={detail.securityCheckYn === 'Y'}
                  />
                  <SignatureCard
                    label="인수자 확인"
                    checked={detail.receiverCheckYn === 'Y'}
                  />
                </div>

                {/* 상태 배지 */}
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-3">
                  <span className="text-xs font-semibold text-slate-500">처리 상태</span>
                  {detail.status === '반입' ? (
                    <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-600">
                      반입
                    </span>
                  ) : (
                    <span className="rounded-full bg-seah-orange-500/10 px-3 py-0.5 text-xs font-bold text-seah-orange-500">
                      반출
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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
