import axios from "axios";
import type { UserCreate, UserLogin } from "../types/user";
import axiosInstance from "../../../common/apis/axios";

const SERVER_URL = "http://localhost:8000/auth";

// 로그인

export const signup = async (data: UserCreate) => {
  const response = await axios.post(`${SERVER_URL}`, data);
  return response.data;
};

export const signin = async (data: UserLogin) => {
  const response = await axios.post(`${SERVER_URL}/login`, data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/me`);
  return response.data;
};
