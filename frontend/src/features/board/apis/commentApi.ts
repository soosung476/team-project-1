import type { CommentCreate, CommentUpdate } from "../types/board";
import axiosInstance from "../../../common/apis/axios";

const url = "http://127.0.0.1:8000";

export const postComment = async (boardId: number, comment: CommentCreate) => {
  const response = await axiosInstance.post(`${url}/boards/${boardId}/comments`, comment);
  return response.data;
};

export const putComment = async (boardId: number, id: number, comment: CommentUpdate) => {
  const response = await axiosInstance.put(`${url}/boards/${boardId}/comments/${id}`, comment);
  return response.data;
};

export const deleteComment = async (boardId: number, id: number) => {
  const response = await axiosInstance.delete(`${url}/boards/${boardId}/comments/${id}`);
  return response.data;
};
