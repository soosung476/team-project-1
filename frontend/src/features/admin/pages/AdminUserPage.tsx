import { useEffect, useState } from "react";
import type { DepartmentResponse } from "../../department/types/department";
import type { AdminUserPageResponse, AdminUserResponse } from "../types/admin";
import AdminUserRow from "../components/AdminUserRow";
import { getUsers } from "../apis/adminApi";
import { getDepartments } from "../../department/apis/departmentApi";
import axios from "axios";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../../../common/components/Pagination";
import { LuSearch } from "react-icons/lu";
import PageHeader from "../../../common/components/PageHeader";
import {
  btnSecondary,
  card,
  emptyText,
  searchBox,
  searchInput,
  th,
  thead,
} from "../../../common/style";

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
  // 전체 사용자 수 (다른 목록처럼 「전체 N명」 표시용)
  const [total, setTotal] = useState(0);

  // 검색: 입력창에 치는 값(keywordInput)과 검색 버튼으로 확정한 값(keyword)을 나눔
  // 서버는 keyword가 바뀔 때만 부르므로 글자를 칠 때마다 요청하지 않음
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  // 화면에 보여줄 페이지 번호 개수 제한 (BoardList와 같은 계산)
  const pageSize = 5;
  const startPage = Math.floor((page - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, totalPages);
  // TODO: useEffect에서 getUsers(), getDepartments()로 위 state 채우기

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
        setTotal(userData.total);
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
    return <p className={emptyText}>관리자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      {/* 부서 관리·회의실 관리로 가는 버튼은 왼쪽 사이드바 「관리자」 메뉴로 옮김 */}
      <PageHeader
        title="사용자 관리"
        description="직원의 부서·직급·권한을 지정합니다. 바꾼 뒤 그 줄의 저장을 누르세요."
        breadcrumb={["관리자", "사용자 관리"]}
      />

      {/* 왼쪽 전체 인원 / 오른쪽 검색 (다른 목록 화면과 같은 배치) */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          전체 <span className="font-semibold text-slate-900">{total}</span>명
        </p>

        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <div className={searchBox}>
            <LuSearch />
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              type="text"
              placeholder="이름 또는 이메일"
              className={searchInput}
            />
          </div>
          <button type="submit" className={btnSecondary}>
            검색
          </button>
        </form>
      </div>

      <div className={`overflow-x-auto ${card}`}>
        <table className="w-full whitespace-nowrap text-sm">
          <thead className={thead}>
            <tr>
              <th className={`${th} text-left`}>이름</th>
              <th className={`${th} w-full text-left`}>이메일</th>
              <th className={`${th} text-center`}>부서</th>
              <th className={`${th} text-center`}>직급</th>
              <th className={`${th} text-center`}>권한</th>
              <th className={th}></th>
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
                  className="px-4 py-12 text-center text-slate-400"
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
