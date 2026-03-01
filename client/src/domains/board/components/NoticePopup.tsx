import { useEffect, useState } from 'react';
import type { PopupNotice } from '../types';

const STORAGE_KEY = 'notice-popup-hidden-date';

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

interface NoticePopupProps {
  notices: PopupNotice[];
}

export function NoticePopup({ notices }: NoticePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notices.length === 0) return;
    const hiddenDate = localStorage.getItem(STORAGE_KEY);
    if (hiddenDate === getTodayString()) return;
    setVisible(true);
    setCurrentIndex(0);
  }, [notices]);

  if (!visible || notices.length === 0) return null;

  const notice = notices[currentIndex];
  const isLast = currentIndex === notices.length - 1;

  function handleConfirm() {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setVisible(false);
    }
  }

  function handleHideToday() {
    localStorage.setItem(STORAGE_KEY, getTodayString());
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-[2px]">
      <div className="w-full max-w-[340px] flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)]">
        {/* Header */}
        <div className="px-7 pb-4 pt-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-6 w-1.5 rounded-full bg-[#E94E1B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E94E1B]">
              NOTICE
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-[#53565A]">
            {notice.boardTitle ?? '공지사항'}
          </h1>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto px-7">
          <div
            className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: notice.boardTxt ?? '' }}
          />
          {notices.length > 1 && (
            <p className="mt-4 text-right text-[12px] text-gray-400">
              {currentIndex + 1} / {notices.length}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-4 p-7">
          <button
            onClick={handleConfirm}
            className="flex w-full items-center justify-center rounded-2xl bg-[#E94E1B] py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.97]"
          >
            {isLast ? '확인' : '다음'}
          </button>
          <div className="flex justify-center">
            <button
              onClick={handleHideToday}
              className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#53565A]"
            >
              오늘 하루 보지 않기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
