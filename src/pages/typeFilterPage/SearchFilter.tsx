// src/components/searchFilter/SearchFilter.tsx
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { type CategoryType } from "@/pages/typeFilterPage/categoryType";

import { useSidoCodes, useSigunguCodes } from "@/hook/useAreaCodes"; // useAreaCodes 훅 임포트
import { useCategoryCodes } from "@/hook/useCategoryCodes";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { SearchFilterRequest } from "@/api/Dto";

interface SearchFilterProps {
  selectedCategory: CategoryType;
  initialConditions: SearchFilterRequest;
  onSearch: (conditions: SearchFilterRequest) => void;
}

export default function SearchFilter({
  selectedCategory,
  initialConditions,
  onSearch,
}: SearchFilterProps) {
  const [conditions, setConditions] = useState<SearchFilterRequest>(() => ({
    contentTypeid:
      initialConditions.contentTypeid || selectedCategory.contentTypeId,
    cat1: initialConditions.cat1 || "_ALL_",
    cat2: initialConditions.cat2 || "_ALL_",
    cat3: initialConditions.cat3 || "_ALL_",
    // areaCode를 URL에서 가져오거나 "_ALL_"로 초기화
    areaCode: initialConditions.areaCode || "_ALL_",
    // lDongSigunguCd는 areaCode에 종속적이므로, areaCode가 _ALL_이면 이도 _ALL_로
    lDongSigunguCd: initialConditions.lDongSigunguCd || "_ALL_",
    title: initialConditions.title || "",
  }));

  // ---------------------- Custom Hook 사용 ----------------------
  // 지역 코드 (시/도는 useSidoCodes로, areaCode와 매핑)
  const {
    data: sidoList,
    isLoading: isSidoLoading,
    error: sidoError,
  } = useSidoCodes();

  // 시/군/구는 areaCode에 종속적으로 가져옴
  const {
    data: sigunguList,
    isLoading: isSigunguLoading,
    error: sigunguError,
  } = useSigunguCodes(
    typeof conditions.areaCode === "string" && conditions.areaCode !== "_ALL_"
      ? conditions.areaCode
      : null
  );

  // 카테고리 코드 (contentTypeid는 소문자 유지)
  const {
    data: mainCategoryList,
    isLoading: isMainCategoryLoading,
    error: mainCategoryError,
  } = useCategoryCodes(conditions.contentTypeid, null, null);
  const {
    data: middleCategoryList,
    isLoading: isMiddleCategoryLoading,
    error: middleCategoryError,
  } = useCategoryCodes(
    conditions.contentTypeid,
    conditions.cat1 !== "_ALL_" ? conditions.cat1 : null,
    null
  );
  const {
    data: detailCategoryList,
    isLoading: isDetailCategoryLoading,
    error: detailCategoryError,
  } = useCategoryCodes(
    conditions.contentTypeid,
    conditions.cat1 !== "_ALL_" ? conditions.cat1 : null,
    conditions.cat2 !== "_ALL_" ? conditions.cat2 : null
  );

  // URL 파라미터 변경 시 conditions 상태를 업데이트 (initialConditions 변경 감지)
  useEffect(() => {
    setConditions((prev) => ({
      ...prev,
      contentTypeid:
        initialConditions.contentTypeid || selectedCategory.contentTypeId,
      cat1: initialConditions.cat1 || "_ALL_",
      cat2: initialConditions.cat2 || "_ALL_",
      cat3: initialConditions.cat3 || "_ALL_",
      // areaCode를 URL에서 가져오거나 "_ALL_"로 처리
      areaCode: initialConditions.areaCode || "_ALL_",
      // lDongSigunguCd는 areaCode에 종속적이므로, areaCode가 _ALL_이면 이도 _ALL_로
      lDongSigunguCd: initialConditions.lDongSigunguCd || "_ALL_",
      title: initialConditions.title || "",
    }));
  }, [initialConditions, selectedCategory]);

  // 대분류 변경 시 중/소분류 초기화
  useEffect(() => {
    if (conditions.cat1 !== initialConditions.cat1) {
      setConditions((prev) => ({
        ...prev,
        cat2: "_ALL_",
        cat3: "_ALL_",
      }));
    }
  }, [conditions.cat1, initialConditions.cat1]);

  // areaCode(시/도) 변경 시 lDongSigunguCd(시/군/구) 초기화
  useEffect(() => {
    if (conditions.areaCode !== initialConditions.areaCode) {
      setConditions((prev) => ({
        ...prev,
        lDongSigunguCd: "_ALL_",
      }));
    }
  }, [conditions.areaCode, initialConditions.areaCode]); // lDongRegnCd 대신 areaCode를 의존성으로

  // Select 박스 등의 값 변경 핸들러
  const handleSelectChange =
    (field: keyof SearchFilterRequest) => (value: string) => {
      setConditions((prev) => ({ ...prev, [field]: value }));
    };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConditions((prev) => ({ ...prev, title: e.target.value }));
  };

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
                value={conditions.cat1}
                onValueChange={handleSelectChange("cat1")}
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
                  <SelectItem value="_ALL_">전체</SelectItem>
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
                value={conditions.cat2}
                onValueChange={handleSelectChange("cat2")}
                disabled={
                  conditions.cat1 === "_ALL_" ||
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
                  <SelectItem value="_ALL_">전체</SelectItem>
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
                value={conditions.cat3}
                onValueChange={handleSelectChange("cat3")}
                disabled={
                  conditions.cat2 === "_ALL_" ||
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
                  <SelectItem value="_ALL_">전체</SelectItem>
                  {detailCategoryList.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 지역 Selects (areaCode - 시/도 역할) */}
            <div className="flex flex-col">
              <Select
                value={conditions.areaCode} // areaCode 사용
                onValueChange={handleSelectChange("areaCode")} // areaCode 핸들러
                disabled={isSidoLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={isSidoLoading ? "로딩 중..." : "시/도 선택"}
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

            {/* 시/군/구 Selects (lDongSigunguCd) */}
            <div className="flex flex-col">
              <Select
                value={conditions.lDongSigunguCd}
                onValueChange={handleSelectChange("lDongSigunguCd")}
                disabled={
                  conditions.areaCode === "_ALL_" || // areaCode가 전체이면 시군구 비활성화
                  isSigunguLoading ||
                  sigunguList.length === 0
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      isSigunguLoading ? "로딩 중..." : "시/군/구 선택"
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
              value={conditions.title}
              onChange={handleKeywordChange}
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
