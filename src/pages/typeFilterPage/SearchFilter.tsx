import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { type CategoryType } from "@/pages/typeFilterPage/categoryType";

// 새롭게 생성한 Custom Hook 임포트
import { useSidoCodes, useSigunguCodes } from "@/hook/useAreaCodes";
import { useCategoryCodes } from "@/hook/useCategoryCodes";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  selectedCategory: CategoryType;
  initialConditions: any;
  onSearch: (conditions: any) => void;
}

export default function SearchFilter({
  selectedCategory,
  initialConditions,
  onSearch,
}: SearchFilterProps) {
  const [conditions, setConditions] = useState(() => ({
    category: initialConditions.category || selectedCategory.value, // 탭 값은 selectedCategory에서, 없으면 initialConditions
    main: initialConditions.main || "",
    mid: initialConditions.mid || "",
    detail: initialConditions.detail || "",
    sido: initialConditions.sido || "",
    sigungu: initialConditions.sigungu || "",
    keyword: initialConditions.keyword || "",
  }));

  // ---------------------- Custom Hook 사용 ----------------------
  // 지역 코드
  const {
    data: sidoList,
    isLoading: isSidoLoading,
    error: sidoError,
  } = useSidoCodes();
  const {
    data: sigunguList,
    isLoading: isSigunguLoading,
    error: sigunguError,
  } = useSigunguCodes(conditions.sido);

  // 카테고리 코드
  const {
    data: mainCategoryList,
    isLoading: isMainCategoryLoading,
    error: mainCategoryError,
  } = useCategoryCodes(selectedCategory.contentTypeId, null, null);
  const {
    data: middleCategoryList,
    isLoading: isMiddleCategoryLoading,
    error: middleCategoryError,
  } = useCategoryCodes(selectedCategory.contentTypeId, conditions.main, null);
  const {
    data: detailCategoryList,
    isLoading: isDetailCategoryLoading,
    error: detailCategoryError,
  } = useCategoryCodes(
    selectedCategory.contentTypeId,
    conditions.main,
    conditions.mid
  );

  // URL 파라미터 변경 시 conditions 상태를 업데이트
  // 이 useEffect는 initialConditions가 변경될 때마다 실행되어 URL과 SearchFilter 상태를 동기화합니다.
  useEffect(() => {
    setConditions({
      category: initialConditions.category || selectedCategory.value,
      main: initialConditions.main || "",
      mid: initialConditions.mid || "",
      detail: initialConditions.detail || "",
      sido: initialConditions.sido || "",
      sigungu: initialConditions.sigungu || "",
      keyword: initialConditions.keyword || "",
    });
  }, [initialConditions, selectedCategory]);

  // 대분류 변경 시 중/소분류 초기화
  useEffect(() => {
    // conditions.main이 initialConditions.main과 다를 때만 초기화 (사용자 입력에 의한 변경)
    if (conditions.main !== initialConditions.main) {
      setConditions((prev) => ({
        ...prev,
        mid: "",
        detail: "",
      }));
    }
  }, [conditions.main, initialConditions.main]); // initialConditions.main을 의존성에 추가

  // 중분류 변경 시 소분류 초기화
  useEffect(() => {
    // conditions.mid가 initialConditions.mid와 다를 때만 초기화
    if (conditions.mid !== initialConditions.mid) {
      setConditions((prev) => ({
        ...prev,
        detail: "",
      }));
    }
  }, [conditions.mid, initialConditions.mid]); // initialConditions.mid를 의존성에 추가

  // 시/도 변경 시 시/군/구 초기화
  useEffect(() => {
    // conditions.sido가 initialConditions.sido와 다를 때만 초기화
    if (conditions.sido !== initialConditions.sido) {
      setConditions((prev) => ({
        ...prev,
        sigungu: "",
      }));
    }
  }, [conditions.sido, initialConditions.sido]); // initialConditions.sido를 의존성에 추가

  const handleLocalSearch = () => {
    onSearch(conditions);
  };

  // 에러 로깅 (디버깅용)
  useEffect(() => {
    if (sidoError) console.error("시/도 로딩 에러:", sidoError);
    if (sigunguError) console.error("시/군/구 로딩 에러:", sigunguError);
    if (mainCategoryError)
      console.error("대분류 로딩 에러:", mainCategoryError);
    if (middleCategoryError)
      console.error("중분류 로딩 에러:", middleCategoryError);
    if (detailCategoryError)
      console.error("소분류 로딩 에러:", detailCategoryError);
  }, [
    sidoError,
    sigunguError,
    mainCategoryError,
    middleCategoryError,
    detailCategoryError,
  ]);

  return (
    <>
      <section id="searchFilter" className="py-4">
        <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start">
          <h3 className="text-xl font-semibold">상세필터</h3>

          <div className="flex flex-wrap gap-4">
            {/* 대분류 Select */}
            <div className="flex flex-col">
              <Select
                value={conditions.main}
                onValueChange={(value) =>
                  setConditions((prev) => ({ ...prev, main: value }))
                }
                disabled={
                  isMainCategoryLoading || mainCategoryList.length === 0
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isMainCategoryLoading ? "로딩 중..." : "대분류 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {mainCategoryList.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 중분류 Select */}
            <div className="flex flex-col">
              <Select
                value={conditions.mid}
                onValueChange={(value) =>
                  setConditions((prev) => ({ ...prev, mid: value }))
                }
                disabled={
                  !conditions.main ||
                  isMiddleCategoryLoading ||
                  middleCategoryList.length === 0
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isMiddleCategoryLoading ? "로딩 중..." : "중분류 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {middleCategoryList.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 소분류 Select */}
            <div className="flex flex-col">
              <Select
                value={conditions.detail}
                onValueChange={(value) =>
                  setConditions((prev) => ({ ...prev, detail: value }))
                }
                disabled={
                  !conditions.mid ||
                  isDetailCategoryLoading ||
                  detailCategoryList.length === 0
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isDetailCategoryLoading ? "로딩 중..." : "소분류 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {detailCategoryList.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 지역 Selects */}
            <div className="flex flex-col">
              <Select
                value={conditions.sido}
                onValueChange={(value) =>
                  setConditions((prev) => ({ ...prev, sido: value }))
                }
                disabled={isSidoLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isSidoLoading ? "로딩 중..." : "법정동시도 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {sidoList.map((sidoItem) => (
                    <SelectItem key={sidoItem.code} value={sidoItem.code}>
                      {sidoItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Select
                value={conditions.sigungu}
                onValueChange={(value) =>
                  setConditions((prev) => ({ ...prev, sigungu: value }))
                }
                disabled={
                  !conditions.sido ||
                  isSigunguLoading ||
                  sigunguList.length === 0
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isSigunguLoading ? "로딩 중..." : "법정동시군구 선택"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {sigunguList.map((sigunguItem) => (
                    <SelectItem key={sigunguItem.code} value={sigunguItem.code}>
                      {sigunguItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="검색어 입력"
              // className="flex-[8] rounded border border-gray-300 px-4 py-2 focus:outline-none"
              value={conditions.keyword}
              onChange={(e) =>
                setConditions((prev) => ({ ...prev, keyword: e.target.value }))
              }
            />
            <Button
              size="lg"
              className="flex-[2] text-lg"
              onClick={handleLocalSearch}
            >
              <Search className="mr-2 h-5 w-5" /> 검색
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
