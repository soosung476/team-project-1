// 프론트에서 백엔드 라우터와 연결하기 위한 Api 정의
import axiosInstance from "../../../common/apis/axios";
import type { NoticeCreate, NoticeUpdate } from "../types/notice";

const url = `http://localhost:8000/notice`;

// 전체 페이지
export const get_notices = async (page: number, size: number) => {
  const response = await axiosInstance.get(`${url}`, { params: { page, size } });
  return response.data;
};
// 페이지 상세내용
export const get_notice = async (id: string) => {
  const response = await axiosInstance.get(`${url}/${id}`);
  return response.data;
};
// 글 작성
export const post_notice = async (notice: NoticeCreate) => {
  const response = await axiosInstance.post(`${url}`, notice);
  return response.data;
};
// 글 삭제
export const delete_notice = async (id: string) => {
  const response = await axiosInstance.delete(`${url}/${id}`);
  return response.data;
};
// 글 수정
export const put_notice = async (notice: NoticeUpdate, id: string) => {
  const response = await axiosInstance.put(`${url}/${id}`, notice);
  return response.data;
};
