/**
 * 모든 API 응답의 기본 형태를 정의하는 DTO
 * 백엔드에서 모든 응답에 공통적으로 사용됩니다.
 */
export interface ApiResponseDto<T> {
  code: string; // 응답 코드 (예: "SUCCESS", "ERROR")
  message: string; // 응답 메시지
  data: T; // 실제 응답 데이터 (제네릭 T로 어떤 타입이든 올 수 있음)
}

/**
 * 검색 필터 요청 파라미터 DTO
 * `/api/search/filter` 요청 시 사용됩니다.
 */
export interface SearchFilterRequest {
  contentTypeid?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  areacode?: string; // areaCode로 변경 (백엔드 요청과 일치)
  title?: string;
  lDongSigunguCd?: string;
  lDongRegnCd?: string;
  // 필요하다면 페이징 관련 파라미터 (pageNo, numOfRows 등) 추가
  // pageNo?: number;
  // numOfRows?: number;
}

// --- 상세 정보 내부에 포함될 수 있는 서브 DTO들 ---

/**
 * 관광지 상세 정보 DTO (tourSpotInfo)
 */
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
  opendate: string; // ISO 8601 형식의 날짜 문자열
  parking: string;
  restdate: string;
  useseason: string;
  usetime: string;
}

/**
 * 문화시설 상세 정보 DTO (culturalFacilityInfo)
 */
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

/**
 * 축제/행사 상세 정보 DTO (festivalInfo)
 * filter 응답에 포함되므로 별도 FestivalDetailDto는 생성하지 않습니다.
 */
export interface FestivalInfo {
  contentId: string;
  agelimit: string;
  bookingplace: string;
  discountinfofestival: string;
  eventenddate: string; // ISO 8601 형식의 날짜 문자열
  eventhomepage: string;
  eventplace: string;
  eventstartdate: string; // ISO 8601 형식의 날짜 문자열
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

/**
 * 관광 코스 상세 정보 DTO (tourCourseInfo)
 */
export interface TourCourseInfo {
  contentId: string;
  distance: string;
  infocentertourcourse: string;
  schedule: string;
  taketime: string;
  theme: string;
}

/**
 * 검색 결과 및 상세 정보에 공통적으로 사용되는 기본 필드 DTO
 * `/api/search/filter` 응답의 배열 내 각 객체와
 * `/api/search/{contentId}` 응답의 data 필드에 해당합니다.
 */
export interface CommonContentDto {
  contentId: string;
  contenttypeid: string;
  cat1: string;
  cat2: string;
  cat3: string;
  areacode: string;
  addr1: string;
  addr2: string;
  firstimage?: string; // 선택적 (필수 아님)
  firstimage2?: string; // 선택적 (필수 아님)
  tel: string;
  title: string;
  zipcode: string;
  modifiedtime: string; // ISO 8601 형식의 날짜 문자열
  createdtime: string; // ISO 8601 형식의 날짜 문자열
  ldongSigunguCd: string;
  ldongRegnCd: string;

  // 개요(overview)와 홈페이지(homepage)는 /api/search/{contentId} 응답에만 있을 수 있습니다.
  overview?: string;
  homepage?: string;

  // 필터 검색 응답 시 포함될 수 있는 상세 정보 객체들
  tourSpotInfo?: TourSpotInfo;
  culturalFacilityInfo?: CulturalFacilityInfo;
  festivalInfo?: FestivalInfo;
  tourCourseInfo?: TourCourseInfo;
}

/**
 * 단일 상세 정보를 나타내는 DTO
 * `/api/search/{contentId}` 응답의 `data` 필드에 해당합니다.
 * CommonContentDto를 확장하여 사용합니다.
 */
export interface DetailDto extends CommonContentDto {
  // 여기에 추가적인 상세 정보 필드를 정의할 수 있지만,
  // 현재 백엔드 응답은 CommonContentDto로 충분해 보입니다.
  // overview, homepage 필드가 이 DTO에 포함될 가능성이 높습니다.
}

/**
 * 필터 검색 응답에서 반환되는 각 아이템의 DTO
 * `/api/search/filter` 응답의 `data` 배열 내 각 객체에 해당합니다.
 * 현재 백엔드 응답에 따르면 DetailDto와 동일한 구조를 가집니다.
 */
export interface FilterSearchItemDto extends CommonContentDto {
  // 필터 검색 결과의 각 아이템은 상세 정보를 포함할 수 있습니다.
  // 따라서 CommonContentDto를 그대로 사용하거나, 필요에 따라 특정 필드만 포함하도록 조정할 수 있습니다.
}
