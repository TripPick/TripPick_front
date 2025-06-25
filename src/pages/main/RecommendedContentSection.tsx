import type { CommonContentDto } from "@/api/Dto";
import searchApi from "@/api/search";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Landmark, MapIcon, PartyPopper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecommendedContentSection() {
  const navigate = useNavigate();

  // 공공데이터포털 기준 contentTypeId: 12(관광지), 14(문화시설), 15(축제공연행사), 25(여행코스)
  const contentTypeIds = useMemo(
    () => ({
      spots: "12", // 관광지
      facilities: "14", // 문화시설
      festivals: "15", // 축제/행사
      courses: "25", // 여행코스
    }),
    []
  );

  // 각 탭의 랜덤 콘텐츠를 저장할 상태
  const [randomContents, setRandomContents] = useState<{
    spots: CommonContentDto[];
    facilities: CommonContentDto[];
    festivals: CommonContentDto[];
    courses: CommonContentDto[];
  }>({
    spots: [],
    facilities: [],
    festivals: [],
    courses: [],
  });

  const [currentTab, setCurrentTab] =
    useState<keyof typeof contentTypeIds>("spots");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomContent = async () => {
      setIsLoading(true);
      setError(null);

      const contentTypeId = contentTypeIds[currentTab];
      if (!contentTypeId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await searchApi.getRandomByContentTypeId(contentTypeId, 4);

        setRandomContents((prev) => ({
          ...prev,
          [currentTab]: data,
        }));
      } catch (err: any) {
        console.error(`랜덤 콘텐츠 로드 실패 (${currentTab}):`, err);
        setError(
          `콘텐츠를 불러오는 중 오류가 발생했습니다: ${
            err.message || "알 수 없는 오류"
          }`
        );
        setRandomContents((prev) => ({
          ...prev,
          [currentTab]: [],
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomContent();
  }, [currentTab, contentTypeIds]);

  const handleButton = () => {
    navigate("/type-filter");
  };

  return (
    <section id="recommendations" className="pt-16 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">타입별 추천 정보</h2>
          <p className="text-muted-foreground mt-2">
            다양한 유형의 여행 정보를 확인하고 다음 여행을 계획해보세요.
          </p>
        </div>
        <div className="mt-12">
          <Tabs
            defaultValue="spots"
            onValueChange={(value) =>
              setCurrentTab(value as keyof typeof contentTypeIds)
            }
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="spots">
                <Landmark className="mr-2 h-5 w-5" />
                관광지
              </TabsTrigger>
              <TabsTrigger value="facilities">
                <Building className="mr-2 h-5 w-5" />
                문화시설
              </TabsTrigger>
              <TabsTrigger value="festivals">
                <PartyPopper className="mr-2 h-5 w-5" />
                축제/행사
              </TabsTrigger>
              <TabsTrigger value="courses">
                <MapIcon className="mr-2 h-5 w-5" />
                여행코스
              </TabsTrigger>
            </TabsList>
            {isLoading ? (
              <div className="text-center mt-4 p-4 text-lg">
                추천 콘텐츠를 불러오는 중...
              </div>
            ) : error ? (
              <div className="text-center mt-4 p-4 text-red-500 text-lg">
                오류: {error}
              </div>
            ) : (
              <>
                <TabsContent value="spots">
                  {randomContents.spots.length > 0 ? (
                    <ContentGrid items={randomContents.spots} />
                  ) : (
                    <div className="text-center mt-4 p-4 text-muted-foreground">
                      관광지 콘텐츠가 없습니다.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="facilities">
                  {randomContents.facilities.length > 0 ? (
                    <ContentGrid items={randomContents.facilities} />
                  ) : (
                    <div className="text-center mt-4 p-4 text-muted-foreground">
                      문화시설 콘텐츠가 없습니다.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="festivals">
                  {randomContents.festivals.length > 0 ? (
                    <ContentGrid items={randomContents.festivals} />
                  ) : (
                    <div className="text-center mt-4 p-4 text-muted-foreground">
                      축제/행사 콘텐츠가 없습니다.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="courses">
                  {randomContents.courses.length > 0 ? (
                    <ContentGrid items={randomContents.courses} />
                  ) : (
                    <div className="text-center mt-4 p-4 text-muted-foreground">
                      여행코스 콘텐츠가 없습니다.
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
          <div className="flex justify-end mt-8">
            <Button
              variant="secondary"
              onClick={handleButton}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-md hover:bg-gray-300"
            >
              더보기
            </Button>
          </div>
        </div>
        {/* <Button
          variant="secondary"
          onClick={handleButton}
          className="fixed bottom-4 right-4 bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-md hover:bg-gray-300"
        >
          더보기
        </Button> */}
      </div>
    </section>
  );
}
