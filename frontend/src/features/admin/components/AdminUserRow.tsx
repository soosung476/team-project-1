import { useState } from "react";
import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserResponse } from "../types/admin";
import { updateUser } from "../apis/adminApi";
import axios from "axios";
import { useAuth } from "../../user/context/AuthContext";

// 한 사람 = 표의 한 줄(tr)
type AdminUserRowProps = {
  user: AdminUserResponse;
  departments: DepartmentResponse[];
};

const AdminUserRow = ({ user, departments }: AdminUserRowProps) => {
  const [role, setRole] = useState(user.role);
  // departmentId 가 있으면 가져오고 없으면 빈문자열로 ㅇㅇ
  const [departmentId, setDepartmentId] = useState(
    user.department ? String(user.department.id) : "",
  );
  const [position, setPosition] = useState(user.position);
  const { user: me } = useAuth();

  const [savedUser, setSavedUser] = useState(user);

  const resetForm = (target: AdminUserResponse) => {
    setRole(target.role);
    setDepartmentId(target.department ? String(target.department.id) : "");
    setPosition(target.position);
  };

  const handleSave = async () => {
    try {
      const updated = await updateUser(user.id, {
        role,
        position,
        department_id: departmentId ? Number(departmentId) : undefined,
      });
      setSavedUser(updated);
      alert("저장되었습니다.");
    } catch (error) {
      resetForm(savedUser);
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-2.5">{user.name}</td>
      <td className="px-4 py-2.5 text-slate-500">{user.email}</td>

      {/* 부서 */}
      <td className="px-4 py-2.5 text-center">
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-1"
        >
          <option value="" disabled>
            부서 없음
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </td>

      {/* 직급: 백엔드 POSITION_LEVEL과 글자가 같아야 함 */}
      <td className="px-4 py-2.5 text-center">
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-1"
        >
          <option value="사원">사원</option>
          <option value="팀장">팀장</option>
          <option value="사장">사장</option>
        </select>
      </td>

      {/* 권한 */}
      <td className="px-4 py-2.5 text-center">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={user.id === me?.id}
          className="rounded-lg border border-slate-200 px-2 py-1"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>

      <td className="px-4 py-2.5 text-center">
        <button
          onClick={() => handleSave()}
          className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          저장
        </button>
      </td>
    </tr>
  );
};

export default AdminUserRow;
