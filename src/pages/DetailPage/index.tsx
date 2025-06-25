// src/pages/DetailPage.tsx
import { useParams } from "react-router-dom"; // useParams 훅 임포트
import { useEffect, useState } from "react";
import ImageSection from "@/pages/DetailPage/ImageSection";
import BasicInfoContent from "@/pages/DetailPage/BasicInfoContent";
import { InfoToggleSection } from "@/components/InfoToggleSection";
import {
  TourSpotInfoContent,
  CulturalFacilityInfoContent,
  FestivalInfoContent,
  TourCourseInfoContent,
  TourCourseItemContent,
} from "@/pages/DetailPage/AdditionalContent";
import searchApi from "@/api/search";
import type { DetailDto } from "@/api/Dto";

// const CONTENT_TYPE_IDS = {
//   TOUR_SPOT: "12", // 관광지
//   CULTURAL_FACILITY: "14", // 문화시설
//   FESTIVAL: "15", // 축제
//   TOUR_COURSE: "25", // 여행 코스
//   // 필요한 다른 타입 ID 추가
// };

export default function DetailPage() {
  const { contentId } = useParams<{ contentId: string }>(); // useParams로 contentId 가져오기
  const [itemDetail, setItemDetail] = useState<DetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("contentid", contentId);
    if (contentId) {
      const fetchDetail = async () => {
        try {
          setLoading(true); // 데이터 로딩 시작
          setError(null); // 에러 초기화

          // detailApi의 getDetail 함수 호출
          const data = await searchApi.getDetailById(contentId);
          setItemDetail(data); // 가져온 데이터를 상태에 저장
          console.log("상세 정보 로드 성공:", data); // 성공 로그
        } catch (err: any) {
          console.error("상세 정보 로드 중 오류 발생:", err);
          setError(err.message || "상세 정보를 가져오는 데 실패했습니다.");
        } finally {
          setLoading(false); // 로딩 완료
        }
      };

      fetchDetail();
    }
  }, [contentId]); // contentId가 변경될 때마다 다시 호출

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!itemDetail) return <div>정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="container mx-auto px-8 py-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 mt-2">
          {itemDetail.title}
        </h1>
        <div className="flex flex-col lg:flex-row ">
          <div className="lg:order-1 lg:w-2/5 lg:mr-8">
            <ImageSection
              imageUrl={itemDetail.firstimage || "/src/assets/logo.png"}
              altText={itemDetail.title}
            />
          </div>
          <div className="lg:order-2 lg:w-3/5">
            <InfoToggleSection title="기본 정보">
              <BasicInfoContent item={itemDetail} />
            </InfoToggleSection>

            {/* 콘텐츠 타입에 따라 추가 정보 섹션 렌더링 */}
            {itemDetail.tourSpotInfo && (
              <InfoToggleSection title="관광지 추가 정보">
                <TourSpotInfoContent info={itemDetail.tourSpotInfo} />
              </InfoToggleSection>
            )}
            {itemDetail.culturalFacilityInfo && (
              <InfoToggleSection title="문화시설 추가 정보">
                <CulturalFacilityInfoContent
                  info={itemDetail.culturalFacilityInfo}
                />
              </InfoToggleSection>
            )}
            {itemDetail.festivalInfo && (
              <InfoToggleSection title="축제 정보">
                <FestivalInfoContent info={itemDetail.festivalInfo} />
              </InfoToggleSection>
            )}
            {itemDetail.tourCourseItem && (
              <InfoToggleSection title="관광 코스 개요">
                <TourCourseItemContent info={itemDetail.tourCourseItem} />
              </InfoToggleSection>
            )}
            {itemDetail.tourCourseInfo && (
              <InfoToggleSection title="관광 코스 정보">
                <TourCourseInfoContent info={itemDetail.tourCourseInfo} />
              </InfoToggleSection>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
