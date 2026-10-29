// 헤더에 sessionStorage에 저장된 access_token을 꺼내서
// 모든 요청에 붙여서 보내기
// 응답이 401이면 refresh_token으로 새 토큰을 받아서 원래 요청을 다시 보내기

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
  async (error) => {
    // 401이 아닌 에러의 경우 Promise.reject를 이용해서 화면의 catch로 넘김
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 401인 경우
    // error.config = 401을 받은 원래 요청(주소·메서드·body) → 이걸로 다시 보낼 수 있음
    const originalRequest = error.config;

    const refreshToken = sessionStorage.getItem("refresh_token");

    // _retry: 이미 한 번 다시 보낸 요청이라는 표시
    // 다시 보낸 요청도 401이면 또 refresh하지 않고 아래 로그인 화면 이동으로 감 (무한 반복 방지)
    if (refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh는 axiosInstance가 아니라 기본 axios로 보냄
        // → 이 인터셉터를 다시 타지 않아서, refresh가 401이어도 refresh를 또 부르며 반복되지 않음
        const response = await axios.post(
          "http://localhost:8000/auth/refresh",
          { refresh_token: refreshToken },
        );
        // 새 토큰 두 개 저장 (refresh_token도 새것으로 바뀜)
        sessionStorage.setItem("access_token", response.data.access_token);
        sessionStorage.setItem("refresh_token", response.data.refresh_token);
        // 원래 요청을 다시 보냄 → 요청 인터셉터가 새 access_token을 헤더에 붙임
        // 결과는 처음 API를 부른 화면으로 그대로 돌아감
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료됐거나 잘못된 경우 → 아래에서 로그아웃 처리
        console.log(refreshError);
      }
    }
    // refresh_token이 없거나, refresh가 실패했거나, 다시 보낸 요청도 401인 경우
    // → 토큰 두 개를 지우고 로그인 화면으로
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    location.href = "/users/signin";
    return Promise.reject(error);
  },
);

export default axiosInstance;
