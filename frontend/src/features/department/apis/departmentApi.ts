import axiosInstance from "../../../common/apis/axios";
import type { DepartmentCreate, DepartmentUpdate } from "../types/department";

const SERVER_URL = "http://localhost:8000/department";

export const getDepartments = async() =>{
  const response = await axiosInstance.get(`${SERVER_URL}`);
  return response.data;
}

export const CreateDepartment = async (data: DepartmentCreate) => {
  const response = await axiosInstance.post(`${SERVER_URL}`, data);
  return response.data;
}

export const UpdateDepartment = async (id: number, data: DepartmentUpdate) => {
  const response = await axiosInstance.put(`${SERVER_URL}/${id}`, data);
  return response.data;
}

export const DeleteDepartment = async (id: number) => {
  await axiosInstance.delete(`${SERVER_URL}/${id}`)
}

