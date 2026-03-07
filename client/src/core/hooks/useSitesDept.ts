/**
 * useSitesDept
 * 사업장(Sites) + 부서(Depts) 목록을 DB에서 가져오는 커스텀 훅.
 * - 사업장 선택 시 해당 사업장의 부서만 필터링 가능
 * - 앱 내에서 한 번 로드 후 캐싱 (모듈 레벨 캐시)
 */

import { useEffect, useState } from 'react';
import { fetchSitesDepts, type DeptItem, type SiteItem } from '@/core/api/commonApi';

// 모듈 레벨 캐시 (컴포넌트 마운트/언마운트와 무관하게 유지)
let _cache: { sites: SiteItem[]; depts: DeptItem[] } | null = null;
let _promise: Promise<void> | null = null;

interface UseSitesDeptReturn {
  sites: SiteItem[];
  depts: DeptItem[];
  loading: boolean;
  error: string | null;
  /** 특정 사업장 코드에 속한 부서 목록 반환 */
  getDeptsBySite: (busiPlace: string) => DeptItem[];
}

export function useSitesDept(): UseSitesDeptReturn {
  const [sites, setSites] = useState<SiteItem[]>(_cache?.sites ?? []);
  const [depts, setDepts] = useState<DeptItem[]>(_cache?.depts ?? []);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache !== null) return;

    if (_promise === null) {
      _promise = fetchSitesDepts()
        .then((data) => {
          _cache = { sites: data.sites, depts: data.depts };
        })
        .catch((err: Error) => {
          _promise = null;
          throw err;
        });
    }

    _promise
      .then(() => {
        if (_cache) {
          setSites(_cache.sites);
          setDepts(_cache.depts);
        }
      })
      .catch((err: Error) => {
        setError(err.message || '사업장/부서 데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getDeptsBySite(busiPlace: string): DeptItem[] {
    return depts.filter((d) => d.busiPlace === busiPlace);
  }

  return { sites, depts, loading, error, getDeptsBySite };
}
