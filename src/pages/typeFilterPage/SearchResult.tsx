import { searchApi, type SearchDto, type SearchParams } from "@/api/search";
import PagedContentGrid from "@/components/PagedContentGrid";
import { category } from "@/pages/typeFilterPage/categoryType";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResult() {
  const [searchParams] = useSearchParams(); // URL 파라미터를 읽어옴
  const [result, setResult] = useState<SearchDto[]>([]); // 검색 결과를 저장할 상태 (SearchDto[] 타입 지정)
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
      const selectedContentTypeId = frontendParams.category
        ? category.find((cat) => cat.value === frontendParams.category) // cat.value로 변경 확인
            ?.contentTypeId
        : undefined;

      // 프론트엔드 파라미터를 백엔드 SearchParams 인터페이스에 맞게 매핑
      const paramsToBackend: SearchParams = {
        contentTypeId: selectedContentTypeId,
        cat1: frontendParams.main,
        cat2: frontendParams.mid,
        cat3: frontendParams.detail,
        lDongRenCd: frontendParams.sido,
        lDongSignguCd: frontendParams.sigungu,
        keyword: frontendParams.keyword,
        // 필요하다면 여기에 페이지네이션 관련 파라미터도 추가
        // page: frontendParams.page ? parseInt(frontendParams.page) : 1,
        // size: frontendParams.size ? parseInt(frontendParams.size) : 10,
      };

      // 값이 없는 파라미터 제거 (undefined, null, 빈 문자열, "_ALL_" 값)
      const cleanedParams: SearchParams = Object.fromEntries(
        Object.entries(paramsToBackend).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "_ALL_"
        )
      ) as SearchParams; // 안전한 캐스팅을 위해 as SearchParams 추가

      console.log(
        "백엔드로 전송될 최종 파라미터 (cleanedParams):",
        cleanedParams
      );

      try {
        // ✅ 이제 searchApi.search는 직접 SearchDto[]를 반환하거나 에러를 던집니다.
        const data = await searchApi.search(cleanedParams);
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
            {/* 필요하다면 여기에 로딩 스피너 아이콘(예: Lucide React의 Loader2) 등을 추가할 수 있습니다. */}
            {/* <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mt-4" /> */}
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
