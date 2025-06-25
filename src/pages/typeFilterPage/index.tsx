import TabList from "@/pages/typeFilterPage/TabList";
import SearchFilter from "@/pages/typeFilterPage/SearchFilter";
import SearchResult from "@/pages/typeFilterPage/SearchResult";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  category,
  type CategoryType,
} from "@/pages/typeFilterPage/categoryType";
import type { SearchFilterRequest } from "@/api/Dto";

export default function TypePage() {
  const [searchParams, setSearchParams] = useSearchParams(); // setSearchParams 추가

  // URL에서 'category' 파라미터를 직접 읽어와 TabList에 전달
  const currentCategoryFromUrl = searchParams.get("category") || "spots"; // 기본값 "spots"

  // URL에서 'keyword' 파라미터를 직접 읽어와 SearchFilter에 전달 (더 이상 필요 없을 수 있음)
  const currentKeywordFromUrl = searchParams.get("keyword") || "";

  const handleSelectCategory = (value: string) => {
    // 새로운 URLSearchParams 객체를 생성하여 'category'만 설정합니다.
    // 이렇게 하면 다른 모든 파라미터는 제거됩니다.
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("category", value);
    setSearchParams(newSearchParams); // URL 업데이트
  };

  // SearchFilter에서 호출될 검색 핸들러
  // 이 함수는 SearchFilter에서 모든 필터 조건을 객체로 받아서 URL을 업데이트합니다.
  const handleSearch = (conditions: SearchFilterRequest) => {
    const newSearchParams = new URLSearchParams();

    // conditions의 각 필드를 URL 파라미터로 추가 (빈 값 제외)
    for (const key in conditions) {
      if (Object.prototype.hasOwnProperty.call(conditions, key)) {
        const value = conditions[key as keyof SearchFilterRequest];
        // undefined, null, 빈 문자열, 그리고 "_ALL_" 값은 파라미터에서 제외
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "_ALL_"
        ) {
          if (key === "areaCode") {
            // 만약 conditions 객체의 키가 areaCode라면
            newSearchParams.set("areacode", value); // URL에는 areacode로 설정
          } else {
            newSearchParams.set(key, value); // 다른 키는 그대로 사용
          }
        }
      }
    }
    setSearchParams(newSearchParams); // URL 업데이트
  };

  // TabList에 넘겨줄 현재 선택된 카테고리 (URL에서 읽음)
  const selectedCategoryData: CategoryType | undefined = category.find(
    (c) => c.value === currentCategoryFromUrl
  );

  return (
    <>
      <TabList
        selectedCategory={currentCategoryFromUrl} // URL에서 읽은 값 전달
        onSelectCategory={handleSelectCategory}
      />
      {selectedCategoryData && (
        <SearchFilter
          initialConditions={
            Object.fromEntries(searchParams.entries()) as SearchFilterRequest
          } // URL에서 모든 초기값 전달
          selectedCategory={selectedCategoryData} // 탭 변경 시 contentTypeId 등 전달용
          onSearch={handleSearch}
        />
      )}
      <SearchResult />
    </>
  );
}
