import axiosInstance from "../../../common/apis/axios";
import type { ApprovalCreate, ApprovalStatusUpdate } from "../types/approval";

const SERVER_URL = "http://localhost:8000/approvals";

export const getPending = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/pending`);
  return response.data;
};
export const getDrafted = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/drafted`);
  return response.data;
};
export const getApproved = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/approved`);
  return response.data;
};
export const getRejected = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/rejected`);
  return response.data;
};

export const getApprovers = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/approvers`);
  return response.data;
};
export const getApproval = async (id: number) => {
  const response = await axiosInstance.get(`${SERVER_URL}/${id}`);
  return response.data;
};

export const deleteApproval = async (id: number) => {
  const response = await axiosInstance.delete(`${SERVER_URL}/${id}`);
  return response.data;
};

export const putApproval = async (id: number, data: ApprovalStatusUpdate) => {
  const response = await axiosInstance.put(`${SERVER_URL}/${id}`, data);
  return response.data;
};
export const postApproval = async (data: ApprovalCreate) => {
  const response = await axiosInstance.post(`${SERVER_URL}`, data);
  return response.data;
};
