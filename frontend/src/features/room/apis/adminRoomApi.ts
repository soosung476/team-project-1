import axiosInstance from "../../../common/apis/axios";   // roomApi.ts 맨 위 import 그대로
import type { AdminReservationPageResponse } from "../types/room";

// 관리자 전체 예약 조회 (페이징)
export const getAdminReservations = async (page: number, size: number) => {
  const response = await axiosInstance.get<AdminReservationPageResponse>("/admin/reservations", {
    params: { page, size },
  });
  return response.data;
};

// 관리자 예약 취소
export const adminDeleteReservation = async (id: number) => {
  const response = await axiosInstance.delete(`/admin/reservations/${id}`);
  return response.data;
};

