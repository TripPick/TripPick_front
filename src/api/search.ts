import { apiClient } from "@/api";

interface SearchParams {
  category?: string;
  main?: string;
  mid?: string;
  detail?: string;
  sido?: string;
  sigungu?: string;
  keyword?: string;
}

export const searchApi = {
  search: (params: SearchParams) =>
    apiClient.get("/search", {
      params,
    }),
};

export default searchApi;
