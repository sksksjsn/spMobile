/**
 * useTransportTypes
 * 운송 유형(TransportTypes) 목록을 DB에서 가져오는 커스텀 훅.
 * - CM_CodeDetail.CODE_TYPE = 'MT16', USE_YN = 'Y' 기반
 * - 앱 내에서 한 번 로드 후 캐싱 (모듈 레벨 캐시)
 */

import { useEffect, useState } from 'react';
import { fetchTransportTypes, type TransportTypeItem } from '@/core/api/commonApi';

// 모듈 레벨 캐시 (컴포넌트 마운트/언마운트와 무관하게 유지)
let _cache: { transportTypes: TransportTypeItem[] } | null = null;
let _promise: Promise<void> | null = null;

interface UseTransportTypesReturn {
  transportTypes: TransportTypeItem[];
  loading: boolean;
  error: string | null;
}

export function useTransportTypes(): UseTransportTypesReturn {
  const [transportTypes, setTransportTypes] = useState<TransportTypeItem[]>(
    _cache?.transportTypes ?? [],
  );
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache !== null) return;

    if (_promise === null) {
      _promise = fetchTransportTypes()
        .then((data) => {
          _cache = { transportTypes: data.transportTypes };
        })
        .catch((err: Error) => {
          _promise = null;
          throw err;
        });
    }

    _promise
      .then(() => {
        if (_cache) {
          setTransportTypes(_cache.transportTypes);
        }
      })
      .catch((err: Error) => {
        setError(err.message || '운송 유형 데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { transportTypes, loading, error };
}
