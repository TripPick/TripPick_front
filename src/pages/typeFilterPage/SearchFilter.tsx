import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { region } from "@/pages/typeFilterPage/region";

interface CategoryData {
  category: string;
  main: {
    main: string;
    sub: {
      mid: string;
      detail: string[];
    }[];
  }[];
}

interface SearchFilterProps {
  selectedCategory: CategoryData;
}
export default function SearchFilter({ selectedCategory }: SearchFilterProps) {
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedMid, setSelectedMid] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");

  // 선택된 값에 대한 대분류, 중분류, 소분류의 목록 생성
  const mainOptions = selectedCategory?.main?.map((m) => m.main) || [];
  const middleOptions = selectedMain
    ? selectedCategory.main
        .find((m) => m.main === selectedMain)
        ?.sub.map((s) => s.mid) || []
    : [];
  const detailOptions = selectedMid
    ? selectedCategory.main
        .flatMap((m) => m.sub)
        .find((s) => s.mid === selectedMid)?.detail || []
    : [];

  useEffect(() => {
    setSelectedMain("");
    setSelectedMid("");
    setSelectedDetail("");
  }, [selectedCategory]);
  useEffect(() => {
    setSelectedMid("");
    setSelectedDetail("");
  }, [selectedMain]);

  useEffect(() => {
    setSelectedDetail("");
  }, [selectedMid]);

  useEffect(() => {
    setSelectedSigungu("");
  }, [selectedSido]);

  // 지역에 대한 select option 생성
  const sidoOptions = Object.keys(region[0].sido);
  const sigunguOptions = selectedSido
    ? region[0].sido[selectedSido]?.sigungu || []
    : [];

  return (
    <>
      <section id="searchFilter" className="bg-secondary/50 py-4">
        <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start">
          <h3 className="text-xl font-semibold">상세필터</h3>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <h6 className="mb-1 text-sm font-medium">대분류</h6>
              <Select value={selectedMain} onValueChange={setSelectedMain}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="대분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  {mainOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h6>중분류</h6>
              <Select
                value={selectedMid}
                onValueChange={setSelectedMid}
                disabled={!selectedMain}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="중분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  {middleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h6>소분류</h6>
              <Select
                value={selectedDetail}
                onValueChange={setSelectedDetail}
                disabled={!selectedMid}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="소분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  {detailOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h6>법정동시도</h6>
              <Select value={selectedSido} onValueChange={setSelectedSido}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="법정동시도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sidoOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <h6>법정동시군구</h6>
              <Select
                value={selectedSigungu}
                onValueChange={setSelectedSigungu}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="법정동시군구 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sigunguOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="검색어 입력"
              className="flex-[8] rounded border border-gray-300 px-4 py-2 focus:outline-none"
            />
            <Button size="lg" className="flex-[2] text-lg">
              <Search className="mr-2 h-5 w-5" /> 검색
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
