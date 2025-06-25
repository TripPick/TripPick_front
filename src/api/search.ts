import { apiClient } from "@/api";
import axios from "axios";
import type {
  ApiResponseDto,
  CommonContentDto,
  DetailDto,
  SearchFilterRequest,
} from "@/api/Dto";

export const searchApi = {
  /**
   * 필터링된 검색 결과를 가져오는 함수
   * POST /api/search/filter
   * @param filters SearchFilterRequest DTO 형태의 필터 조건 (요청 바디)
   * @returns CommonContentDto 배열
   */
  getFilteredSearches: async (
    filters: SearchFilterRequest // filters 객체를 그대로 받음
  ): Promise<CommonContentDto[]> => {
    try {
      const params = new URLSearchParams();

      // filters 객체의 각 속성을 순회하며 쿼리 파라미터로 추가
      // null, undefined, 빈 문자열, "_ALL_" 값은 쿼리 파라미터에서 제외 (여기서만 정제)
      for (const [key, value] of Object.entries(filters)) {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "_ALL_"
        ) {
          params.append(key, String(value));
        }
      }

      const url = `/search/filter?${params.toString()}`;
      const response = await apiClient.get<ApiResponseDto<CommonContentDto[]>>(
        url
      );
      return response.data.data;
    } catch (error) {
      console.error("필터링된 검색 결과를 가져오는 데 실패했습니다:", error);
      throw error;
    }
  },

  /**
   * 특정 contentId에 해당하는 상세 정보를 가져오는 함수
   * GET /api/search/{contentId}
   * @param contentId 상세 정보를 조회할 콘텐츠 ID
   * @returns DetailDto 객체
   */
  getDetailById: async (contentId: string): Promise<DetailDto> => {
    try {
      const response = await apiClient.get<ApiResponseDto<DetailDto>>(
        `/search/${contentId}`
      );

      // 백엔드 응답 코드가 "SUCCESS"인지 확인합니다.
      if (response.data.code === "SUCCESS") {
        if (response.data.data) {
          // DetailDto는 백엔드 응답 구조와 일치하도록 설계되었으므로,
          // 별도의 변환 없이 바로 데이터를 반환합니다.
          return response.data.data;
        } else {
          console.warn(
            `contentId ${contentId} 에 대한 상세 정보가 없습니다 (getDetailById).`
          );
          throw new Error("정보를 찾을 수 없습니다.");
        }
      } else {
        // 'code'가 'SUCCESS'가 아닌 경우 (백엔드에서 실패 응답)
        throw new Error(
          response.data.message || "데이터 로드 실패: 백엔드 오류"
        );
      }
    } catch (error) {
      console.error(
        `API 호출 중 오류 발생 (getDetailById - ${contentId}):`,
        error
      );
      if (axios.isAxiosError(error)) {
        throw new Error(`네트워크 오류 또는 서버 응답 문제: ${error.message}`);
      }
      throw error;
    }
  },
};

export default searchApi;
