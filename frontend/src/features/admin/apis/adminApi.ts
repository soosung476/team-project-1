import axiosInstance from "../../../common/apis/axios";
import type { AdminUserUpdate } from "../types/admin";

const SERVER_URL = "http://localhost:8000/admin";

export const getUsers = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/users`);
  return response.data;
};

export const updateUser = async (id: number, data: AdminUserUpdate) => {
  const response = await axiosInstance.patch(`${SERVER_URL}/users/${id}`, data);
  return response.data;
};
