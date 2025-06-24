import axios from "axios";

const API_KEY = import.meta.env.VITE_TOUR_API_KEY;
const BASE_URL = "http://apis.data.go.kr/B551011/KorService2";

export interface AreaCodeItem {
  rnum: number;
  code: string; // 지역 코드 (sidoCode, sigunguCode)
  name: string; // 지역 이름 (ex: "서울특별시", "종로구")
}

// API 응답의 'items' 내부 구조를 정의
interface ResponseItems {
  item: AreaCodeItem[] | AreaCodeItem; // item이 배열이거나 단일 객체일 수 있음
}

// API 응답의 'body' 내부 구조를 정의
interface ResponseBody {
  items?: ResponseItems; // items가 없을 수도 있음 (예: 결과 없음)
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

// 최종 API 응답 인터페이스
export interface AreaCodeResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: ResponseBody;
  };
}

export const areaApi = {
  // 시/도 코드 조회 (areaCode = null)
  // 시/군/구 코드 조회 (areaCode = 시도 코드)
  getAreaCodes: async (
    areaCode: string | null = null
  ): Promise<AreaCodeItem[]> => {
    try {
      const params = {
        serviceKey: API_KEY,
        numOfRows: 100, // 최대 100개까지 가져오도록 설정 (필요에 따라 조절)
        pageNo: 1,
        MobileOS: "ETC", // 또는 'AND', 'IOS'
        MobileApp: "AppTest", // 본인 앱 이름
        _type: "json", // JSON 응답 요청
        areaCode: areaCode, // 시/도 코드를 넘기면 시/군/구 조회
      };

      const response = await axios.get<AreaCodeResponse>(
        `${BASE_URL}/areaCode2`,
        { params }
      );

      // 응답 데이터의 유효성 검사 강화 (이전과 유사하지만 좀 더 명확하게)
      const apiResponse = response.data?.response;
      const header = apiResponse?.header;
      const body = apiResponse?.body;
      const itemsWrapper = body?.items;

      if (!apiResponse || !header || header.resultCode !== "0000") {
        console.error(
          "API 응답 실패 또는 유효하지 않은 응답:",
          header?.resultMsg || "알 수 없는 오류",
          response.data
        );
        return [];
      }

      // itemsWrapper가 없거나 item이 없는 경우 빈 배열 반환
      if (!itemsWrapper || !itemsWrapper.item) {
        // 단일 결과가 없거나, 목록이 비어있을 때
        return [];
      }

      // itemsWrapper.item이 배열이면 그대로 사용하고, 단일 객체이면 배열로 변환
      const items = Array.isArray(itemsWrapper.item)
        ? itemsWrapper.item
        : [itemsWrapper.item]; // 단일 객체일 경우 배열로 감싸줌

      return items;
    } catch (error) {
      console.error("지역 코드 API 호출 중 예외 발생:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            "Axios HTTP 에러:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("Axios 요청 에러 (응답 없음):", error.request);
        } else {
          console.error("Axios 설정 에러:", error.message);
        }
      }
      return [];
    }
  },
};
