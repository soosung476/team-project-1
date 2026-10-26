import { useEffect, useState } from "react";
import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserResponse } from "../types/admin";
import AdminUserRow from "../components/AdminUserRow";
import { getUsers } from "../apis/adminApi";
import { getDepartments } from "../../department/apis/departmentApi";
import axios from "axios";
import { useAuth } from "../../user/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminUserPage = () => {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // TODO: useEffect에서 getUsers(), getDepartments()로 위 state 채우기

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role !== "ADMIN") return;
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.detail);
        } else {
          alert("서버에 연결할 수 없습니다.");
        }
      }
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.detail);
        } else {
          alert("서버에 연결할 수 없습니다.");
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) return null;
  if (user?.role !== "ADMIN") {
    return <p className="text-slate-500">관리자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">사용자 관리</h1>
      <button onClick={()=>navigate("/department")}
        className="cursor-pointer rounded-lg border
        border-slate-200 bg-white px-3 py-1.5
        text-xs font-semibold text-slate-600 shadow-xs
        transition
        hover:border-indigo-200 hover:bg-indigo-50
        hover:text-indigo-600">
        부서 관리 
      </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full whitespace-nowrap text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">
                이름
              </th>
              <th className="w-full px-4 py-2.5 text-left font-medium text-slate-500">
                이메일
              </th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-500">
                부서
              </th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-500">
                직급
              </th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-500">
                권한
              </th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <AdminUserRow
                key={user.id}
                user={user}
                departments={departments}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserPage;
