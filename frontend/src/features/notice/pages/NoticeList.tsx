// 공지사항 전체 화면
// searchParams 를 통해 가져오기
// page, size 정의하고 불러오기
// 로그인 한 유저 중 어드민 권한 가진 유저만 글쓰기 버튼 보이게 하기
// 화면에 보여줄 페이지 개수 제한
// page, size 가져오려면 hooks 먼저 만들기

import { Link, useSearchParams } from "react-router-dom";
import useNotices from "../hooks/useNotices";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../components/Pagination";

const NoticeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  const data = useNotices(Page, Size);
  const { total, total_pages } = data;

  const { isLoggedIn, user } = useAuth();
  const pageSize = 5;
  const startpage = Math.floor((Page - 1) / pageSize) * pageSize + 1;
  const endpage = Math.min(startpage + pageSize - 1, total_pages);
  const onPageChange = (page: number) => {
    setSearchParams({
      page: String(page),
      size: String(Size),
    });
  };

  return (
    <div>
      <div className="mb-8 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        <span className="text-slate-600">공지사항</span>
      </div>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">공지사항</h1>

          <p className="mt-2 text-slate-500">공지사항 내용을 확인하세요.</p>
        </div>

        {user?.role == "ADMIN" && isLoggedIn && (
          <Link
            to="/notices/write"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            글쓰기
          </Link>
        )}
      </div>

      {/* Count */}
      <div className="mb-3 text-sm text-slate-500">
        전체 <span className="font-semibold text-slate-900">{total}</span>개의 게시글
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-20 px-6 py-4 text-center font-medium text-slate-500">번호</th>
              <th className="px-6 py-4 text-left font-medium text-slate-500">제목</th>
              <th className="w-32 px-6 py-4 text-center font-medium text-slate-500">작성자</th>
              <th className="w-32 px-6 py-4 text-center font-medium text-slate-500">작성일</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.items.map((post) => (
              <tr
                key={post.id}
                className={post.is_pinned === "Y" ? `transition bg-slate-200` : `transition hover:bg-slate-50`}
              >
                <td className="px-6 py-5 text-center text-slate-400">{post.id}</td>

                <td className="px-6 py-5">
                  <Link
                    to={`/notices/${post.id}?page=${Page}&size=${Size}`}
                    className="font-medium text-slate-800 hover:text-indigo-600"
                  >
                    {post.is_pinned === "Y" ? `[고정] ${post.title}` : `${post.title}`}
                  </Link>
                </td>

                <td className="px-6 py-5 text-center text-slate-500">{post.author.name}</td>

                <td className="px-6 py-5 text-center text-slate-400">{post.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={Page}
        start={startpage}
        end={endpage}
        totalPages={total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default NoticeList;
