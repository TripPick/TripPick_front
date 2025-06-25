import { apiClient } from "@/api";
import axios from "axios";
import type {
  ApiResponseDto,
  CommonContentDto,
  CulturalFacilityInfo,
  DetailDto,
  FestivalInfo,
  SearchFilterRequest,
  TourCourseInfo,
  TourCourseItem,
  TourSpotInfo,
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
      // 1단계: 기본적인 SearchDto (이제 DetailDto로 대체) 정보를 먼저 가져옵니다.
      const response = await apiClient.get<ApiResponseDto<DetailDto>>(
        `/search/${contentId}` // 백엔드의 getSearchById와 매핑되는 엔드포인트
      );

      if (response.data.code === "OK" && response.data.data) {
        let detailData: DetailDto = response.data.data; // 기본 정보

        // 2단계: contentTypeId에 따라 추가 상세 정보를 가져옵니다.
        const contentTypeId = detailData.contenttypeid;
        console.log("contentTypeId 실제 타입:", typeof contentTypeId);
        console.log("contentTypeId 실제 값:", contentTypeId);

        switch (contentTypeId) {
          case "12": // 관광지
            console.log("관광지 상세 검색 시작");
            const tourSpotRes = await apiClient.get<
              ApiResponseDto<TourSpotInfo>
            >(
              `/tourspots/${contentId}` // 백엔드의 @RequestMapping("/api/tourspots")와 매핑
            );
            if (tourSpotRes.data.code === "OK" && tourSpotRes.data.data) {
              detailData = {
                ...detailData,
                tourSpotInfo: tourSpotRes.data.data,
              };
              console.log("관광지 상세정보", detailData);
            }
            break;
          case "14": // 문화시설
            const culturalRes = await apiClient.get<
              ApiResponseDto<CulturalFacilityInfo>
            >(
              `/culturalfacilities/${contentId}` // 백엔드의 @RequestMapping("/api/culturalfacilities")와 매핑
            );
            if (culturalRes.data.code === "OK" && culturalRes.data.data) {
              detailData = {
                ...detailData,
                culturalFacilityInfo: culturalRes.data.data,
              };
            }
            break;
          case "15": // 축제/공연/행사
            const festivalRes = await apiClient.get<
              ApiResponseDto<FestivalInfo>
            >(
              `/festivals/${contentId}` // 백엔드의 @RequestMapping("/api/festivals")와 매핑
            );
            if (festivalRes.data.code === "OK" && festivalRes.data.data) {
              detailData = {
                ...detailData,
                festivalInfo: festivalRes.data.data,
              };
            }
            break;
          case "25": // 여행 코스
            const tourCourseRes = await apiClient.get<
              ApiResponseDto<TourCourseInfo>
            >(
              `/tourcourses/${contentId}` // 백엔드의 @RequestMapping("/api/tourcourses")와 매핑
            );
            if (tourCourseRes.data.code === "OK" && tourCourseRes.data.data) {
              detailData = {
                ...detailData,
                tourCourseInfo: tourCourseRes.data.data,
              };
            }
            // TourCourseItemController의 getTourCourseById를 호출
            const tourCourseItemRes = await apiClient.get<
              // 변수명 변경 (tourCourseItem -> tourCourseItemRes)
              ApiResponseDto<TourCourseItem> // 백엔드에서 반환하는 타입에 맞게 DTO 타입 변경
            >(
              `/touritems/${contentId}` // 백엔드의 @RequestMapping("/api/touritems")와 매핑
            );

            if (
              tourCourseItemRes.data.code === "OK" &&
              tourCourseItemRes.data.data
            ) {
              // tourCourseRes -> tourCourseItemRes로 변경
              detailData = {
                ...detailData,
                tourCourseItem: tourCourseItemRes.data.data, // detailData에 tourCourseItemInfo 추가
              };
            }
            break;
          default:
            // 그 외의 contentTypeId는 추가 상세 정보가 없거나, 아직 처리되지 않은 경우
            break;
        }
        return detailData; // 통합된 DetailDto 반환
      } else {
        console.warn(
          `contentId ${contentId} 에 대한 기본 정보가 없습니다 (getDetailById).`
        );
        throw new Error("정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error(
        `API 호출 중 오류 발생 (getDetailById - ${contentId}):`,
        error
      );
      // 에러 처리 로직
      throw error;
    }
  },

  /**
   * contentTypeId에 해당하는 랜덤값을 가져오는 함수
   * GET /api/search/random
   * @param contentTypeid 랜덤 조회하는 api
   * @returns DetailDto 객체
   */
  getRandomByContentTypeId: async (
    contentTypeid: string,
    limit: number = 4
  ): Promise<CommonContentDto[]> => {
    try {
      const response = await apiClient.get<ApiResponseDto<CommonContentDto[]>>(
        `/search/random?contentTypeId=${contentTypeid}&limit=${limit}` // 백엔드의 getSearchById와 매핑되는 엔드포인트
      );
      if (response.data.code === "OK" && response.data.data) {
        console.log("randomdata", response.data.data);
        return response.data.data;
      } else {
        const errorMessage =
          response.data.message || "유효하지 않은 API 응답입니다.";
        throw new Error(
          `API 응답 오류 (getRandomByContentTypeID - ${contentTypeid}): ${errorMessage}`
        );
      }
    } catch (error) {
      console.error(
        `API 호출 중 오류 발생 (getRandomByContentTypeID - ${contentTypeid}):`,
        error
      );
      throw error;
    }
  },
};

export default searchApi;
