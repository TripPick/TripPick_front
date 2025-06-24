import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ 여기서 호출
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
