// tourSpotInfo 객체에 대한 인터페이스 정의
export interface TourSpotInfo {
  contentId: string;
  accomcount: string;
  chkbabycarriage: string;
  chkcreditcard: string;
  chkpet: string;
  expagerange: string;
  expguide: string;
  heritage1: string;
  heritage2: string;
  heritage3: string;
  infocenter: string;
  opendate: string; // Date 객체 또는 string으로
  parking: string;
  restdate: string;
  useseason: string;
  usetime: string;
}

// culturalFacilityInfo 객체에 대한 인터페이스 정의
export interface CulturalFacilityInfo {
  contentId: string;
  accomcountculture: string;
  chkbabycarriageculture: string;
  chkcreditcardculture: string;
  chkpetculture: string;
  discountinfo: string;
  infocenterculture: string;
  parkingculture: string;
  parkingfee: string;
  restdateculture: string;
  usefee: string;
  usetimeculture: string;
  scale: string;
  spendtime: string;
}

// festivalInfo 객체에 대한 인터페이스 정의
export interface FestivalInfo {
  contentId: string;
  agelimit: string;
  bookingplace: string;
  discountinfofestival: string;
  eventenddate: string;
  eventhomepage: string;
  eventplace: string;
  eventstartdate: string;
  placeinfo: string;
  playtime: string;
  program: string;
  spendtimefestival: string;
  sponsor1: string;
  sponsor1tel: string;
  sponsor2: string;
  sponsor2tel: string;
  subevent: string;
  usetimefestival: string;
}

// tourCourseInfo 객체에 대한 인터페이스 정의
export interface TourCourseInfo {
  contentId: string;
  distance: string;
  infocentertourcourse: string;
  schedule: string;
  taketime: string;
  theme: string;
}

// 메인 DetailDto 인터페이스
export interface DetailDto {
  contentId: string;
  contentTypeId: string; // 콘텐츠 타입 ID 추가
  cat1: string;
  cat2: string;
  cat3: string;
  areaCode: string;
  addr1: string;
  addr2: string;
  firstimage: string;
  firstimage2: string;
  tel: string;
  title: string;
  zipcode: string;
  overview: string; // 개요 정보 추가 (API 응답에 따라)
  homepage?: string; // 홈페이지 추가 (API 응답에 따라)
  modifiedtime: string;
  createdtime: string;
  ldongSigunguCd: string;
  ldongRegnCd: string;

  // 선택적 추가 정보 (콘텐츠 타입에 따라 존재할 수 있음)
  tourSpotInfo?: TourSpotInfo;
  culturalFacilityInfo?: CulturalFacilityInfo;
  festivalInfo?: FestivalInfo;
  tourCourseInfo?: TourCourseInfo;
}
