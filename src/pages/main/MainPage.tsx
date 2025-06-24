import InputWithIcon from "@/components/InputWithIcon";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  MapPin,
  Mountain,
  Search,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";
import RecommendedContentSection from "./RecommendedContentSection";
import { useMemo, useState } from "react";
import TravelSession from "./TravelSession";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const travelThemes = useMemo(
    () => [
      {
        title: "힐링 & 휴식",
        icon: <Hotel className="w-8 h-8" />,
        color:
          "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300",
      },
      {
        title: "미식 탐방",
        icon: <UtensilsCrossed className="w-8 h-8" />,
        color:
          "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
      },
      {
        title: "자연 & 모험",
        icon: <Mountain className="w-8 h-8" />,
        color: "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300",
      },
      {
        title: "도시 & 문화",
        icon: <UserPlus className="w-8 h-8" />,
        color:
          "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
      },
    ],
    []
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const categories = [
    { value: "spots", label: "관광지" },
    { value: "facilities", label: "문화시설" },
    { value: "festivals", label: "축제/행사" },
    { value: "courses", label: "여행코스" },
  ];

  const handleSearch = () => {
    // 선택한 값과 검색어를 쿼리 파라미터로 전달
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (keyword) params.append("keyword", keyword);

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
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-full min-w-[var(--radix-select-trigger-width)] rounded-md border border-gray-300 bg-white shadow-lg"
                    sideOffset={5}
                  >
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category.value} >
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
      <TravelSession travelThemes={travelThemes} />
    </>
  );
}
