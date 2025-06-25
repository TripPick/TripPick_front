// src/pages/DetailPage.tsx
import { useParams } from "react-router-dom"; // useParams 훅 임포트
import { useEffect, useState } from "react";
import ImageSection from "@/pages/DetailPage/ImageSection";
import BasicInfoContent from "@/pages/DetailPage/BasicInfoContent";
import { InfoToggleSection } from "@/components/InfoToggleSection";
import type { DetailDto } from "@/pages/DetailPage/DetailDto";
import {
  TourSpotInfoContent,
  CulturalFacilityInfoContent,
  FestivalInfoContent,
  TourCourseInfoContent,
} from "@/pages/DetailPage/AdditionalContent";

export default function DetailPage() {
  const { contentId } = useParams<{ contentId: string }>(); // useParams로 contentId 가져오기
  const [itemDetail, setItemDetail] = useState<DetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentId) {
      const fetchDetail = async () => {};
      fetchDetail();
    }
  }, [contentId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!itemDetail) return <div>정보를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        {itemDetail.title}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:order-2 lg:w-1/2">
          <ImageSection
            imageUrl={itemDetail.firstimage}
            altText={itemDetail.title}
          />
        </div>
        <div className="lg:order-1 lg:w-1/2">
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
          {itemDetail.tourCourseInfo && (
            <InfoToggleSection title="관광 코스 정보">
              <TourCourseInfoContent info={itemDetail.tourCourseInfo} />
            </InfoToggleSection>
          )}
        </div>
      </div>
    </div>
  );
}
