import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserResponse } from "../types/admin";

// 한 사람 = 표의 한 줄(tr)
type AdminUserRowProps = {
  user: AdminUserResponse;
  departments: DepartmentResponse[];
};

const AdminUserRow = ({ user, departments }: AdminUserRowProps) => {
  // TODO: role, position, departmentId state (처음 값은 user에서)
  // TODO: 저장 버튼 → updateUser

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-2.5">{user.name}</td>
      <td className="px-6 py-2.5 text-slate-500">{user.email}</td>

      {/* 부서 */}
      <td className="px-6 py-2.5 text-center">
        <select className="rounded-lg border border-slate-200 px-2 py-1">
          <option value="" disabled>
            부서 없음
          </option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </td>

      {/* 직급: 백엔드 POSITION_LEVEL과 글자가 같아야 함 */}
      <td className="px-6 py-2.5 text-center">
        <select className="rounded-lg border border-slate-200 px-2 py-1">
          <option value="사원">사원</option>
          <option value="팀장">팀장</option>
          <option value="사장">사장</option>
        </select>
      </td>

      {/* 권한 */}
      <td className="px-6 py-2.5 text-center">
        <select className="rounded-lg border border-slate-200 px-2 py-1">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>

      <td className="px-6 py-2.5 text-center">
        <button className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700">
          저장
        </button>
      </td>
    </tr>
  );
};

export default AdminUserRow;
