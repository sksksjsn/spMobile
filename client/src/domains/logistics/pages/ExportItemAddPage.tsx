import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, FolderOpen, Layers, LogOut, Package, X } from 'lucide-react';
import { useAuthStore } from '@/core/store/useAuthStore';
import { useExportDraftStore } from '../store/useExportDraftStore';

const UNITS = ['EA', '개', '세트', 'KG', 'TON', 'M', 'BOX', '장'];

const INPUT_CLS =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-seah-gray-500 ' +
  'placeholder-slate-300 focus:border-seah-orange-400 focus:outline-none focus:ring-1 ' +
  'focus:ring-seah-orange-400';

const SELECT_CLS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-seah-gray-500 ' +
  'focus:border-seah-orange-400 focus:outline-none focus:ring-1 focus:ring-seah-orange-400';

const LABEL_CLS = 'mb-1 block text-xs font-semibold text-slate-500';

export function ExportItemAddPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { items, editingIndex, addItem, updateItem, setEditingIndex } = useExportDraftStore();

  const isEdit = editingIndex !== null;
  const editTarget = isEdit ? items[editingIndex] : null;

  const [name, setName] = useState(editTarget?.name ?? '');
  const [spec, setSpec] = useState(editTarget?.spec ?? '');
  const [unit, setUnit] = useState(editTarget?.unit ?? 'EA');
  const [maker, setMaker] = useState(editTarget?.maker ?? '');
  const [quantity, setQuantity] = useState(editTarget?.quantity ?? '');
  const [reason, setReason] = useState(editTarget?.reason ?? '');
  const [note, setNote] = useState(editTarget?.note ?? '');
  const [photos, setPhotos] = useState<string[]>(editTarget?.photos ?? []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      setEditingIndex(null);
    };
  }, [setEditingIndex]);

  function handlePhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // reset so same file can be selected again
    e.target.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): string | null {
    if (!name.trim()) return '자재명을 입력해주세요.';
    if (!unit) return '단위를 선택해주세요.';
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
      return '올바른 반출 수량을 입력해주세요.';
    if (!reason.trim()) return '반출 사유를 입력해주세요.';
    if (photos.length === 0) return '사진을 최소 1장 첨부해주세요.';
    return null;
  }

  function handleConfirm() {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const itemData = { name, spec, unit, maker, quantity, reason, note, photos };

    if (isEdit) {
      updateItem(editingIndex, itemData);
    } else {
      addItem(itemData);
    }

    navigate(-1);
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
      <div className="mx-auto max-w-screen-md px-4 pb-28 pt-6 md:px-6">
        {/* Page Title */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex size-8 items-center justify-center rounded-lg text-seah-gray-500 transition-colors hover:bg-slate-200"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <Package size={20} className="text-seah-orange-500" />
          <h1 className="text-lg font-bold text-seah-gray-500">
            {isEdit ? '물품 수정' : '물품 추가'}
          </h1>
        </div>

        <div className="space-y-4">
          {/* ── 물품 정보 ──────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-seah-gray-500">물품 정보</h2>

            <div className="space-y-4">
              {/* 자재명 */}
              <div>
                <label className={LABEL_CLS}>
                  자재명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="자재명을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 규격 */}
              <div>
                <label className={LABEL_CLS}>규격</label>
                <input
                  type="text"
                  placeholder="규격을 입력해주세요 (예: 100×50×3T)"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 단위 / 메이커 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>
                    단위 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className={SELECT_CLS}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>메이커</label>
                  <input
                    type="text"
                    placeholder="제조사명"
                    value={maker}
                    onChange={(e) => setMaker(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* 반출 수량 */}
              <div>
                <label className={LABEL_CLS}>
                  반출 수량 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="수량을 입력해주세요"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 반출 사유 */}
              <div>
                <label className={LABEL_CLS}>
                  반출 사유 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="반출 사유를 입력해주세요 (예: 수리, 교체, 반품 등)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* 비고 */}
              <div>
                <label className={LABEL_CLS}>비고</label>
                <textarea
                  placeholder="추가 내용을 입력해주세요"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className={
                    'w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm ' +
                    'text-seah-gray-500 placeholder-slate-300 focus:border-seah-orange-400 ' +
                    'focus:outline-none focus:ring-1 focus:ring-seah-orange-400'
                  }
                />
              </div>
            </div>
          </div>

          {/* ── 사진 첨부 ──────────────────────────────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-seah-gray-500">
                사진 첨부 <span className="text-rose-500">*</span>
              </h2>
              <span className="text-xs text-slate-400">최소 1장 필수</span>
            </div>

            {/* 사진 미리보기 그리드 */}
            {photos.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={src}
                      alt={`첨부사진 ${i + 1}`}
                      className="size-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow"
                      aria-label="사진 삭제"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 사진 추가 버튼 */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={
                  'flex items-center justify-center gap-2 rounded-lg border-2 border-dashed ' +
                  'border-slate-300 py-4 text-sm font-medium text-slate-400 transition-colors ' +
                  'hover:border-seah-orange-400 hover:text-seah-orange-500'
                }
              >
                <FolderOpen size={18} />
                갤러리에서 선택
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className={
                  'flex items-center justify-center gap-2 rounded-lg border-2 border-dashed ' +
                  'border-slate-300 py-4 text-sm font-medium text-slate-400 transition-colors ' +
                  'hover:border-seah-orange-400 hover:text-seah-orange-500'
                }
              >
                <Camera size={18} />
                카메라로 촬영
              </button>
            </div>
            {/* 갤러리 파일 선택 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoAdd}
            />
            {/* 카메라 직접 촬영 input */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoAdd}
            />

            {photos.length === 0 && (
              <p className="mt-2 text-center text-[11px] text-slate-400">
                물품 상태를 확인할 수 있는 사진을 첨부해주세요
              </p>
            )}
          </div>

          {/* ── 버튼 ───────────────────────────────────────── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-seah-gray-500 transition-colors hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-seah-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-seah-orange-600"
            >
              <Package size={16} />
              {isEdit ? '수정 완료' : '추가 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
