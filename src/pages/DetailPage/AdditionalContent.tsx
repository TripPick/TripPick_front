import type {
  TourSpotInfo,
  CulturalFacilityInfo,
  FestivalInfo,
  TourCourseInfo,
  TourCourseItem,
  TourCourseItemData,
} from "@/api/Dto";
import React from "react";

const TourSpotInfoContent: React.FC<{ info: TourSpotInfo }> = ({ info }) => (
  <div className="space-y-2 text-base">
    {info.usetime && (
      <p>
        <strong>이용 시간:</strong> {info.usetime}
      </p>
    )}
    {info.restdate && (
      <p>
        <strong>휴무일:</strong> {info.restdate}
      </p>
    )}
    {info.parking && (
      <p>
        <strong>주차 시설:</strong> {info.parking}
      </p>
    )}
    {info.chkbabycarriage && (
      <p>
        <strong>유모차 대여:</strong> {info.chkbabycarriage}
      </p>
    )}
    {info.chkcreditcard && (
      <p>
        <strong>신용카드 가능:</strong> {info.chkcreditcard}
      </p>
    )}
    {info.chkpet && (
      <p>
        <strong>반려동물 동반:</strong> {info.chkpet}
      </p>
    )}
    {info.infocenter && (
      <p>
        <strong>문의 및 안내:</strong> {info.infocenter}
      </p>
    )}
    {info.opendate && (
      <p>
        <strong>개장일:</strong> {new Date(info.opendate).toLocaleDateString()}
      </p>
    )}
  </div>
);

const CulturalFacilityInfoContent: React.FC<{ info: CulturalFacilityInfo }> = ({
  info,
}) => (
  <div className="space-y-2 text-base">
    {info.usetimeculture && (
      <p>
        <strong>이용 시간:</strong> {info.usetimeculture}
      </p>
    )}
    {info.restdateculture && (
      <p>
        <strong>휴무일:</strong> {info.restdateculture}
      </p>
    )}
    {info.usefee && (
      <p>
        <strong>이용 요금:</strong> {info.usefee}
      </p>
    )}
    {info.parkingculture && (
      <p>
        <strong>주차 시설:</strong> {info.parkingculture}
      </p>
    )}
    {info.discountinfo && (
      <p>
        <strong>할인 정보:</strong> {info.discountinfo}
      </p>
    )}
  </div>
);

const FestivalInfoContent: React.FC<{ info: FestivalInfo }> = ({ info }) => (
  <div className="space-y-2 text-base">
    {info.eventstartdate && info.eventenddate && (
      <p>
        <strong>행사 기간:</strong>{" "}
        {new Date(info.eventstartdate).toLocaleDateString()} ~{" "}
        {new Date(info.eventenddate).toLocaleDateString()}
      </p>
    )}
    {info.eventplace && (
      <p>
        <strong>행사 장소:</strong> {info.eventplace}
      </p>
    )}
    {info.playtime && (
      <p>
        <strong>공연 시간:</strong> {info.playtime}
      </p>
    )}
    {info.program && (
      <p>
        <strong>주요 프로그램:</strong> {info.program}
      </p>
    )}
    {info.agelimit && (
      <p>
        <strong>관람 연령:</strong> {info.agelimit}
      </p>
    )}
  </div>
);

const TourCourseInfoContent: React.FC<{ info: TourCourseInfo }> = ({
  info,
}) => (
  <div className="space-y-2 text-base">
    {info.distance && (
      <p>
        <strong>총 거리:</strong> {info.distance}
      </p>
    )}
    {info.taketime && (
      <p>
        <strong>소요 시간:</strong> {info.taketime}
      </p>
    )}
    {info.theme && (
      <p>
        <strong>테마:</strong> {info.theme}
      </p>
    )}
    {info.schedule && (
      <p>
        <strong>일정:</strong> {info.schedule}
      </p>
    )}
  </div>
);

// TourCourseInfoContent 컴포넌트
const TourCourseItemContent: React.FC<{ info: TourCourseItemData }> = ({
  info,
}) => (
  <div className="space-y-2 text-base p-4 border rounded-lg shadow-md bg-white font-inter">
    {info.subname && (
      <p className="text-gray-800">
        <strong className="font-semibold text-gray-900">코스명:</strong>{" "}
        {info.subname}
      </p>
    )}
    {info.subdetailoverview && (
      <p className="text-gray-800 leading-relaxed">
        <strong className="font-semibold text-gray-900">코스 개요:</strong>{" "}
        {info.subdetailoverview}
      </p>
    )}
    {info.subdetailimg && (
      <div className="flex justify-center items-center py-2">
        <img
          src={info.subdetailimg || "/src/assets/logo.png"}
          alt={info.subdetailalt || "코스 이미지"}
          className="rounded-xl object-cover w-full max-w-lg h-auto max-h-80 shadow-lg transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/CCCCCC/000000?text=이미지%20없음";
            e.currentTarget.alt = "이미지 없음";
          }}
        />
      </div>
    )}
    {info.subdetailalt && info.subdetailimg && (
      <p className="text-sm text-gray-600 text-center italic mt-1">
        <em>(이미지 설명: {info.subdetailalt})</em>
      </p>
    )}
  </div>
);

export {
  TourSpotInfoContent,
  CulturalFacilityInfoContent,
  FestivalInfoContent,
  TourCourseInfoContent,
  TourCourseItemContent,
};
