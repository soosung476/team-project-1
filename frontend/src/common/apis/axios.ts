// 헤더에 sessionStorage에 저장된 access_token을 꺼내서
// 모든 요청에 붙여서 보내기

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
      sessionStorage.removeItem("access_token");
      location.href = "/users/signin";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
