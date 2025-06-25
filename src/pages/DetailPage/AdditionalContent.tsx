import React from "react";
import type {
  TourSpotInfo,
  CulturalFacilityInfo,
  FestivalInfo,
  TourCourseInfo,
} from "@/pages/DetailPage/DetailDto";

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

export {
  TourSpotInfoContent,
  CulturalFacilityInfoContent,
  FestivalInfoContent,
  TourCourseInfoContent,
};
