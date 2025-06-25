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

// 새롭게 정의된 Custom DTO 임포트
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
    contentTypeId:
      initialConditions.contentTypeId || selectedCategory.contentTypeId,
    cat1: initialConditions.cat1 || "",
    cat2: initialConditions.cat2 || "",
    cat3: initialConditions.cat3 || "",
    lDongRegnCd: initialConditions.lDongRegnCd || "_ALL_", // 초기값에 "_ALL_" 적용
    lDongSigunguCd: initialConditions.lDongSigunguCd || "_ALL_", // 초기값에 "_ALL_" 적용
    title: initialConditions.title || "",
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
  } = useSigunguCodes(conditions.lDongRegnCd);

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
  } = useCategoryCodes(selectedCategory.contentTypeId, conditions.cat1, null);
  const {
    data: detailCategoryList,
    isLoading: isDetailCategoryLoading,
    error: detailCategoryError,
  } = useCategoryCodes(
    selectedCategory.contentTypeId,
    conditions.cat1,
    conditions.cat2
  );

  // URL 파라미터 변경 시 conditions 상태를 업데이트
  useEffect(() => {
    setConditions({
      contentTypeId:
        initialConditions.contentTypeId || selectedCategory.contentTypeId,
      cat1: initialConditions.cat1 || "",
      cat2: initialConditions.cat2 || "",
      cat3: initialConditions.cat3 || "",
      lDongRegnCd: initialConditions.lDongRegnCd || "_ALL_", // 초기값에 "_ALL_" 적용
      lDongSigunguCd: initialConditions.lDongSigunguCd || "_ALL_", // 초기값에 "_ALL_" 적용
      title: initialConditions.title || "",
    });
  }, [initialConditions, selectedCategory]);

  // 대분류 변경 시 중/소분류 초기화
  useEffect(() => {
    if (conditions.cat1 !== initialConditions.cat1) {
      setConditions((prev) => ({
        ...prev,
        cat2: "",
        cat3: "",
      }));
    }
  }, [conditions.cat1, initialConditions.cat1]);

  // 중분류 변경 시 소분류 초기화
  useEffect(() => {
    if (conditions.cat2 !== initialConditions.cat2) {
      setConditions((prev) => ({
        ...prev,
        cat3: "",
      }));
    }
  }, [conditions.cat2, initialConditions.cat2]);

  // 시/도 변경 시 시/군/구 초기화
  useEffect(() => {
    if (conditions.lDongRegnCd !== initialConditions.lDongRegnCd) {
      setConditions((prev) => ({
        ...prev,
        lDongSigunguCd: "_ALL_", // 시/도 변경 시 시/군/구 초기화 값을 "_ALL_"로 변경
      }));
    }
  }, [conditions.lDongRegnCd, initialConditions.lDongRegnCd]);

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
      <section id="searchFilter" className="bg-secondary/50 py-4">
        <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start">
          <h3 className="text-xl font-semibold">상세필터</h3>

          <div className="flex flex-wrap gap-4">
            {/* 대분류 Select (카테고리는 일반적으로 "전체"를 사용하지 않음) */}
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
                  !conditions.cat1 ||
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
                  !conditions.cat2 ||
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

            {/* 지역 Selects */}
            <div className="flex flex-col">
              <Select
                value={conditions.lDongRegnCd}
                onValueChange={handleSelectChange("lDongRegnCd")}
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
                value={conditions.lDongSigunguCd}
                onValueChange={handleSelectChange("lDongSigunguCd")}
                disabled={
                  !conditions.lDongRegnCd ||
                  conditions.lDongRegnCd === "_ALL_" || // "전체"가 선택되면 시군구 비활성화
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
                  <SelectItem value="_ALL_">전체</SelectItem>
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
