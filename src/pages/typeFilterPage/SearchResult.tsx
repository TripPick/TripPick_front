import { searchApi } from "@/api/search";
import PagedContentGrid from "@/components/PagedContentGrid";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CommonContentDto, SearchFilterRequest } from "@/api/Dto";
import { useNavigate } from "react-router-dom";

export default function SearchResult() {
  const [searchParams] = useSearchParams(); // URL 파라미터를 읽어옴
  const [result, setResult] = useState<CommonContentDto[]>([]); // 검색 결과를 저장할 상태 (CommonContentDto[] 타입 지정)
  const [isLoading, setIsLoading] = useState<boolean>(false); // API 호출 중인지 나타내는 상태
  const [error, setError] = useState<string | null>(null); // 오류 메시지를 저장할 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true); // API 호출 시작 시 로딩 상태 true
      setError(null); // 새로운 검색 시작 시 이전 에러 초기화
      setResult([]); // 새로운 검색 시작 시 이전 결과 초기화 (선택 사항)

      console.log("--- SearchResult useEffect 실행 ---");
      console.log(
        "현재 URL searchParams (원본):",
        Object.fromEntries(searchParams.entries())
      );

      const paramsToBackend: SearchFilterRequest = {
        contentTypeid: searchParams.get("contentTypeid") || undefined,
        cat1: searchParams.get("cat1") || undefined,
        cat2: searchParams.get("cat2") || undefined,
        cat3: searchParams.get("cat3") || undefined,
        areacode: searchParams.get("areacode") || undefined,
        lDongSigunguCd: searchParams.get("lDongSigunguCd") || undefined,
        title: searchParams.get("title") || undefined,
      };

      // ✅ 필수 검색 조건이 하나라도 있는지 확인
      const hasSearchCriteria = Object.values(paramsToBackend).some(
        (value) => value !== undefined
      );

      // ✅ 필수 검색 조건이 없는 경우 API 호출을 막고 메시지 표시
      if (!hasSearchCriteria) {
        console.log("검색 조건이 없습니다. API 호출을 건너뛰고 메시지 표시.");
        setIsLoading(false);
        // 사용자에게 메시지를 보여주거나 다른 페이지로 리다이렉트 (선택 사항)
        // navigate("/"); // 예: 홈 페이지로 리다이렉트
        return; // API 호출을 하지 않고 함수 종료
      }

      console.log(paramsToBackend);
      try {
        // ✅ searchApi.getFilteredSearches 함수 호출로 변경
        // 이 함수는 CommonContentDto[]를 직접 반환하거나 에러를 던집니다.
        const response = await searchApi.getFilteredSearches(paramsToBackend);
        setResult(response);
        console.log("검색 결과 업데이트 완료", response);
      } catch (err: any) {
        console.error("SearchResult에서 API 호출 중 최종 오류 발생:", err);
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        console.log("--- SearchResult useEffect 종료 ---");
      }
    };

    fetchSearchResults();
  }, [searchParams, navigate]);

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start mt-10">
        <h3 className="text-xl font-semibold mb-4">검색 결과</h3>

        {isLoading && (
          <div className="text-center py-8">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>오류 발생: {error}</p>
            <p>
              백엔드 서버 상태, CORS 설정, 데이터베이스 연결을 확인해주세요.
            </p>
          </div>
        )}

        {!Object.values(Object.fromEntries(searchParams.entries())).some(
          (value) => value
        ) && (
          <p className="text-center py-8 text-gray-500">
            검색 조건을 입력해주세요.
          </p>
        )}

        {/* 결과 표시 또는 결과 없음 메시지 */}
        {/* 로딩 중이 아니고 에러도 없을 때만 결과를 표시합니다. */}
        {Object.values(Object.fromEntries(searchParams.entries())).some(
          (value) => value
        ) &&
          (result.length > 0 ? (
            <PagedContentGrid items={result} />
          ) : (
            <p className="text-center py-8 text-gray-500">
              선택하신 조건에 맞는 검색 결과가 없습니다.
            </p>
          ))}
      </div>
    </>
  );
}
