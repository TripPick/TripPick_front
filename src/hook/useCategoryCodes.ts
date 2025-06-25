// src/hooks/useCategoryCodes.ts

import { useState, useEffect } from "react";
import { categoryApi, type CategoryCodeItem } from "@/api/category"; // api 경로 확인

interface UseCategoryCodesResult {
  data: CategoryCodeItem[];
  isLoading: boolean;
  error: Error | null;
}

export function useCategoryCodes(
  contentTypeId: string | null = null,
  cat1: string | null = null,
  cat2: string | null = null
): UseCategoryCodesResult {
  const [data, setData] = useState<CategoryCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCodes = async () => {
      if (!contentTypeId) {
        // contentTypeId가 없으면 호출하지 않음
        setData([]);
        setIsLoading(false);
        return;
      }
      // 대분류를 가져올 때 (cat1이 null) 초기에는 로딩 상태가 true로 시작
      // 중분류, 소분류를 가져올 때는 (cat1 또는 cat2가 있을 때) 로딩 상태를 true로 변경
      setIsLoading(true);
      setError(null);
      try {
        const result = await categoryApi.getCategoryCodes(
          contentTypeId,
          cat1,
          cat2
        );
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCodes();
  }, [contentTypeId, cat1, cat2]); // 모든 의존성 포함

  return { data, isLoading, error };
}
