/**
 * useUnits
 * 단위(Units) 목록을 DB에서 가져오는 커스텀 훅.
 * - CM_CodeDetail.CODE_TYPE = 'MT35' 기반
 * - 앱 내에서 한 번 로드 후 캐싱 (모듈 레벨 캐시)
 */

import { useEffect, useState } from 'react';
import { fetchUnits, type UnitItem } from '@/core/api/commonApi';

// 모듈 레벨 캐시 (컴포넌트 마운트/언마운트와 무관하게 유지)
let _cache: { units: UnitItem[] } | null = null;
let _promise: Promise<void> | null = null;

interface UseUnitsReturn {
  units: UnitItem[];
  loading: boolean;
  error: string | null;
}

export function useUnits(): UseUnitsReturn {
  const [units, setUnits] = useState<UnitItem[]>(_cache?.units ?? []);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache !== null) return;

    if (_promise === null) {
      _promise = fetchUnits()
        .then((data) => {
          _cache = { units: data.units };
        })
        .catch((err: Error) => {
          _promise = null;
          throw err;
        });
    }

    _promise
      .then(() => {
        if (_cache) {
          setUnits(_cache.units);
        }
      })
      .catch((err: Error) => {
        setError(err.message || '단위 데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { units, loading, error };
}
