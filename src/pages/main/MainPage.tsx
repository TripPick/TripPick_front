import InputWithIcon from "@/components/InputWithIcon";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
} from "lucide-react";
import RecommendedContentSection from "./RecommendedContentSection";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TravelSession from "./TravelSession";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const categories = [
    { value: "spots", label: "관광지", contentTypeId: 12 },
    { value: "facilities", label: "문화시설", contentTypeId: 14 },
    { value: "festivals", label: "축제/행사", contentTypeId: 15 },
    { value: "courses", label: "여행코스", contentTypeId: 25 },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      const foundCategory = categories.find(
        (cat) => cat.value === selectedCategory
      );
      if (foundCategory) {
        params.append("contentTypeid", String(foundCategory.contentTypeId)); // 숫자를 문자열로 변환하여 추가
      }
    }

    // 2. 키워드를 "title" 파라미터로 추가
    if (keyword) {
      params.append("title", keyword);
    }

    navigate(`/type-filter?${params.toString()}`);
  };

  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* ✅ 배경 영상 */}
        <video
          className="absolute inset-0 w-full h-full object-cover scale-[1.3]"
          src="/src/assets/한국_여행지_드론_영상_제작.mp4" // 👉 public 폴더 기준 경로 또는 외부 URL
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* ✅ 콘텐츠 영역 */}
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            여행하고 싶은 곳이 어디인가요?
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200 drop-shadow-lg">
            대한민국의 숨겨진 여행지를 발견하고, 여러분의 최고의 순간을
            계획해보세요.
          </p>
          <div className="mt-8 max-w-3xl p-4 bg-background/80 dark:bg-background/60 backdrop-blur-md text-black rounded-xl shadow-2xl">
            <div className="flex gap-4 items-center">
              {/* 셀렉트 (2) */}
              <div className="flex-[2] min-w-0">
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => {
                    setSelectedCategory(val);
                  }}
                >
                  <SelectTrigger
                    className="w-full rounded-md border border-gray-300 bg-white"
                    size="default"
                  >
                    <SelectValue placeholder="카테고리 선택">
                      {" "}
                      {selectedCategory
                        ? categories.find(
                            (cat) => cat.value === selectedCategory
                          )?.label
                        : "카테고리 선택"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[var(--radix-select-trigger-width)] rounded-md border border-gray-300 bg-white text-black shadow-lg"
                    sideOffset={4}
                  >
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 입력창 (7) */}
              <div className="flex-[6] min-w-0">
                <InputWithIcon
                  icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                  iconPosition="left"
                  className="w-full rounded-md border border-gray-300 px-3 py-1 h-9 bg-white text-black"
                  placeholder="도시나 지역을 검색해보세요..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              {/* 버튼 (1) */}
              <div className="flex-[2] min-w-0">
                <Button
                  size="default"
                  className="w-full rounded-md h-9 px-4"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" /> 검색
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RecommendedContentSection />
    </>
  );
}
