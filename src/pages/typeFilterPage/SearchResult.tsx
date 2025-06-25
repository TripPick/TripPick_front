import { searchApi } from "@/api/search";
import PagedContentGrid from "@/components/PagedContentGrid";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CommonContentDto, SearchFilterRequest } from "@/api/Dto";

export default function SearchResult() {
  const [searchParams] = useSearchParams(); // URL 파라미터를 읽어옴
  const [result, setResult] = useState<CommonContentDto[]>([]); // 검색 결과를 저장할 상태 (CommonContentDto[] 타입 지정)
  const [isLoading, setIsLoading] = useState<boolean>(false); // API 호출 중인지 나타내는 상태
  const [error, setError] = useState<string | null>(null); // 오류 메시지를 저장할 상태

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

      const frontendParams = Object.fromEntries(searchParams.entries());

      // 'category' (탭 값)를 백엔드에서 사용하는 'contentTypeId'로 변환
      // URL 파라미터에 'category'가 없거나 유효하지 않으면 'tour' (관광지)를 기본값으로 사용
      const defaultCategoryValue = "spots"; // '관광지'에 해당하는 value

      // URL에서 받은 category 값 또는 기본값 'tour'를 사용하여 contentTypeId를 찾습니다.
      const effectiveCategoryValue =
        frontendParams.category || defaultCategoryValue;

      // 프론트엔드 파라미터를 백엔드 SearchFilterRequest 인터페이스에 맞게 매핑
      const paramsToBackend: SearchFilterRequest = {
        contentTypeid: effectiveCategoryValue, // 'contentTypeid' -> 'contentTypeId' (오타 수정 반영)
        cat1: frontendParams.main,
        cat2: frontendParams.mid,
        cat3: frontendParams.detail,
        lDongRegnCd: frontendParams.sido,
        lDongSigunguCd: frontendParams.sigungu,
        title: frontendParams.keyword,
      };
      console.log(paramsToBackend);

      try {
        // ✅ searchApi.getFilteredSearches 함수 호출로 변경
        // 이 함수는 CommonContentDto[]를 직접 반환하거나 에러를 던집니다.
        const data = await searchApi.getFilteredSearches(paramsToBackend);
        setResult(data);
        console.log("검색 결과 업데이트 완료. 항목 수:", data.length);
      } catch (err: any) {
        console.error("SearchResult에서 API 호출 중 최종 오류 발생:", err);
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        console.log("--- SearchResult useEffect 종료 ---");
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start">
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

        {/* 결과 표시 또는 결과 없음 메시지 */}
        {/* 로딩 중이 아니고 에러도 없을 때만 결과를 표시합니다. */}
        {!isLoading && !error && (
          <>
            {result.length > 0 ? (
              <PagedContentGrid items={result} />
            ) : (
              <p className="text-center py-8 text-gray-500">
                선택하신 조건에 맞는 검색 결과가 없습니다.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
