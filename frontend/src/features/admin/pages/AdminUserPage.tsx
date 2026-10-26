import { useEffect, useState } from "react";
import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserPageResponse, AdminUserResponse } from "../types/admin";
import AdminUserRow from "../components/AdminUserRow";
import { getUsers } from "../apis/adminApi";
import { getDepartments } from "../../department/apis/departmentApi";
import axios from "axios";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../../../common/components/Pagination";

// 한 페이지에 보여줄 사용자 수
// 컴포넌트 밖에 두면 바뀌지 않는 값이라 useEffect 의존성에 넣지 않아도 됨
const size = 10;

const AdminUserPage = () => {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  const { user, loading } = useAuth();

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 검색: 입력창에 치는 값(keywordInput)과 검색 버튼으로 확정한 값(keyword)을 나눔
  // 서버는 keyword가 바뀔 때만 부르므로 글자를 칠 때마다 요청하지 않음
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  // 화면에 보여줄 페이지 번호 개수 제한 (BoardList와 같은 계산)
  const pageSize = 5;
  const startPage = Math.floor((page - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, totalPages);

  // 사용자 목록: 페이지나 검색어가 바뀌면 다시 불러옴
  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role !== "ADMIN") return;
      try {
        const userData: AdminUserPageResponse = await getUsers(
          page,
          size,
          keyword,
        );
        setUsers(userData.items);
        setTotalPages(userData.total_pages);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.detail);
        } else {
          alert("서버에 연결할 수 없습니다.");
        }
      }
    };
    fetchUsers();
  }, [user, page, keyword]);

  // 부서 목록: 페이지를 넘겨도 바뀌지 않으므로 처음 한 번만 불러옴
  useEffect(() => {
    const fetchDepartments = async () => {
      if (user?.role !== "ADMIN") return;
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
    fetchDepartments();
  }, [user]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    setKeyword(keywordInput);
    // 다른 페이지를 보다가 검색해도 결과는 1페이지부터 보여줌
    setPage(1);
  };

  if (loading) return null;
  if (user?.role !== "ADMIN") {
    return <p className="text-slate-500">관리자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>

        <form
          onSubmit={handleSearch}
          className="flex w-72 overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-indigo-500"
        >
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            type="text"
            placeholder="이름 또는 이메일"
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="px-5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            검색
          </button>
        </form>
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
            {keyword && users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        start={startPage}
        end={endPage}
      />
    </div>
  );
};

export default AdminUserPage;
