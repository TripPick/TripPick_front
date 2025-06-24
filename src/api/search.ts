import { apiClient } from "@/api";
import axios from "axios";

// 백엔드 반환 결과 Dto
export interface SearchDto {
  // 백엔드에서 받은 실제 데이터
  contentId: string;
  firstimage?: string; // 백엔드에서 받은 실제 firstimage (이미지 URL)
  title?: string;
  addr1?: string;
}

export interface SearchParams {
  contentTypeId?: number;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  lDongRenCd?: string;
  lDongSignguCd?: string;
  keyword?: string;
}

interface ApiResponseDto<T> {
  code: string; // Java의 private String code; 에 해당
  message: string; // Java의 private String message; 에 해당
  data: T; // Java의 private T data; 에 해당
}

export const searchApi = {
  // 백엔드 API 호출 및 데이터 반환
  _internalSearchRaw: (params: SearchParams) =>
    apiClient.get<ApiResponseDto<any[]>>("/contents", { params }),

  getDistinctCat1: () => apiClient.get<ApiResponseDto<string[]>>("/cat1"),

  // 데이터 가공
  search: async (params: SearchParams): Promise<SearchDto[]> => {
    try {
      const response = await searchApi._internalSearchRaw(params);

      // 백엔드 호출 성공 여부 판단
      if (response.data.code === "OK") {
        if (Array.isArray(response.data.data)) {
          // 백엔드 데이터를 SearchDto 타입에 맞춰 매핑합니다.
          const formattedResults: SearchDto[] = response.data.data.map(
            (item: any) => ({
              contentId: item.contentId,
              title: item.title,
              addr1: item.addr1,
              addr2: item.addr2,
              firstimage: item.firstimage,
              firstimage2: item.firstimage2, // firstimage2도 백엔드에 있다면 매핑
            })
          );
          return formattedResults; // 포맷팅된 결과 반환
        } else {
          // data가 배열이 아닌 경우 (백엔드 응답 구조 불일치)
          console.warn(
            "API 응답 데이터 형식이 배열이 아닙니다 (searchApi):",
            response.data.data
          );
          throw new Error(
            response.data.message || "API 응답 데이터 형식이 잘못되었습니다."
          );
        }
      } else {
        // 'code'가 'OK'가 아닌 경우 (백엔드에서 실패 응답)
        throw new Error(
          response.data.message || "데이터 로드 실패: 백엔드 오류"
        );
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생 (searchApi.search):", error);
      // Axios 에러인 경우 Axios의 메시지를 사용 (예: Network Error)
      if (axios.isAxiosError(error)) {
        throw new Error("네트워크 오류 또는 서버 응답 문제: " + error.message);
      }
      throw error; // 그 외의 알 수 없는 에러는 다시 던집니다.
    }
  },
};

export default searchApi;
