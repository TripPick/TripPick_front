import { useState, useEffect } from "react";
import { areaApi, type AreaCodeItem } from "@/api/area"; // api 경로 확인

interface UseAreaCodesResult {
  data: AreaCodeItem[];
  isLoading: boolean;
  error: Error | null;
}

// 시/도 목록을 가져오는 훅
export function useSidoCodes(isAll=true): UseAreaCodesResult {
  const [data, setData] = useState<AreaCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await areaApi.getAreaCodes(null);

        // --- 여기에 "전체" 항목 추가 ---
        let allOption: AreaCodeItem
        if(isAll){
          allOption = {
            rnum: 0, // 고유한 값 (API 응답과 겹치지 않게)
            code: "_ALL_", // 중요: "전체"를 나타내는 고유한 코드 (빈 문자열이 일반적)
            name: "전체", // 또는 "선택 안 함", "시/도 선택" 등
          };
          setData([allOption, ...result]);
        }
        setData([...result]);
        // API 결과 앞에 "전체" 옵션을 추가합니다.

      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCodes();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return { data, isLoading, error };
}

// 특정 시/도에 해당하는 시/군/구 목록을 가져오는 훅
export function useSigunguCodes(sidoCode: string | null): UseAreaCodesResult {
  const [data, setData] = useState<AreaCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 초기에는 로딩 중 아님
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCodes = async () => {
      // sidoCode가 없거나 "_ALL_"이면 목록을 비우고 로딩을 종료
      if (!sidoCode || sidoCode === "_ALL_") {
        setData([{ rnum: 0, code: "_ALL_", name: "전체" }]); // 시/군/구도 "전체" 옵션만 포함
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await areaApi.getAreaCodes(sidoCode);

        // "전체" 항목을 API 결과 앞에 추가
        const allOption: AreaCodeItem = {
          rnum: 0,
          code: "_ALL_",
          name: "전체",
        };
        setData([allOption, ...result]); // 시/군/구 목록에도 "전체" 추가
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCodes();
  }, [sidoCode]); // sidoCode가 변경될 때마다 실행

  return { data, isLoading, error };
}
