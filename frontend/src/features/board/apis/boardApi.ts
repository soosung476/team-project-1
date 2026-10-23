import axios from "axios";
import type { BoardCreate, BoardUpdate } from "../types/board";
import axiosInstance from "../../../common/apis/axios";

const url = `http://127.0.0.1:8000/board`;
export const getBoards = async (page: number, size: number, criteria: string, keyword: string) => {
  const response = await axios.get(`${url}`, {
    params: { page, size, criteria, keyword },
  });
  return response.data;
};

export const getRecents = async () => {
  const response = await axios.get(`${url}/recents`);
  return response.data;
};

export const getBoard = async (id: string) => {
  const response = await axiosInstance.get(`${url}/${id}`);
  return response.data;
};

export const postBoard = async (board: BoardCreate) => {
  const response = await axiosInstance.post(`${url}`, board);
  return response.data;
};

export const putBoard = async (id: string, board: BoardUpdate) => {
  const response = await axiosInstance.put(`${url}/${id}`, board);
  return response.data;
};

export const deleteBoard = async (id: string) => {
  const response = await axiosInstance.delete(`${url}/${id}`);
  return response.data;
};

export const getComments = async (id: string) => {
  const response = await axiosInstance.get(`${url}/${id}/comments`);
  return response.data;
};
