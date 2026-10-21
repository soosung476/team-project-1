import { useState } from "react";
import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserResponse } from "../types/admin";
import AdminUserRow from "../components/AdminUserRow";

const AdminUserPage = () => {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  // TODO: useEffect에서 getUsers(), getDepartments()로 위 state 채우기

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">사용자 관리</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-2.5 text-left font-medium text-slate-500">
                이름
              </th>
              <th className="px-6 py-2.5 text-left font-medium text-slate-500">
                이메일
              </th>
              <th className="px-6 py-2.5 text-center font-medium text-slate-500">
                부서
              </th>
              <th className="px-6 py-2.5 text-center font-medium text-slate-500">
                직급
              </th>
              <th className="px-6 py-2.5 text-center font-medium text-slate-500">
                권한
              </th>
              <th className="px-6 py-2.5"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <AdminUserRow key={u.id} user={u} departments={departments} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserPage;
