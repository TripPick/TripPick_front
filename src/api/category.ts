import axios from "axios";

const API_KEY = import.meta.env.VITE_TOUR_API_KEY; // .env 변수명 확인
const BASE_URL = "http://apis.data.go.kr/B551011/KorService2";

export interface CategoryCodeItem {
  rnum: number;
  code: string; // 대분류(cat1), 중분류(cat2), 소분류(cat3) 코드
  name: string; // 대분류명, 중분류명, 소분류명
}

// areaApi.ts의 AreaCodeResponse와 유사한 구조
export interface CategoryCodeResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        // items가 없을 수도 있음 (예: 결과 없음)
        item: CategoryCodeItem[] | CategoryCodeItem; // item이 배열이거나 단일 객체일 수 있음
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export const categoryApi = {
  getCategoryCodes: async (
    contentTypeId: string, // 필수: 관광타입 ID
    cat1: string | null = null, // 선택: 대분류 코드
    cat2: string | null = null // 선택: 중분류 코드
  ): Promise<CategoryCodeItem[]> => {
    try {
      const params: any = {
        // params 타입 any로 유연하게
        serviceKey: API_KEY,
        numOfRows: 100,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "AppTest",
        _type: "json",
        contentTypeId: contentTypeId, // 관광타입 ID
      };

      // cat1이 있으면 추가
      if (cat1) {
        params.cat1 = cat1;
      }
      // cat2이 있으면 추가
      if (cat2) {
        params.cat2 = cat2;
      }

      const response = await axios.get<CategoryCodeResponse>(
        `${BASE_URL}/categoryCode2`,
        { params }
      );

      const apiResponse = response.data?.response;
      const header = apiResponse?.header;
      const body = apiResponse?.body;
      const itemsWrapper = body?.items;

      if (!apiResponse || !header || header.resultCode !== "0000") {
        console.error(
          "카테고리 API 응답 실패 또는 유효하지 않은 응답:",
          header?.resultMsg || "알 수 없는 오류",
          response.data
        );
        return [];
      }

      if (!itemsWrapper || !itemsWrapper.item) {
        return [];
      }

      const items = Array.isArray(itemsWrapper.item)
        ? itemsWrapper.item
        : [itemsWrapper.item];

      return items;
    } catch (error) {
      console.error("카테고리 코드 API 호출 중 예외 발생:", error);
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
