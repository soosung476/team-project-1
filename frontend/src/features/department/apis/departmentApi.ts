import axiosInstance from "../../../common/apis/axios";

const SERVER_URL = "http://localhost:8000/department";

export const getDepartments = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}`);
  return response.data;
};
