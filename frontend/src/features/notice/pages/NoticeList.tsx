// 공지사항 전체 화면
// searchParams 를 통해 가져오기
// page, size 정의하고 불러오기
// 로그인 한 유저 중 어드민 권한 가진 유저만 글쓰기 버튼 보이게 하기
// 화면에 보여줄 페이지 개수 제한
// page, size 가져오려면 hooks 먼저 만들기

import { Link, useSearchParams } from "react-router-dom";
import useNotices from "../hooks/useNotices";
import { useAuth } from "../../user/context/AuthContext";
// 페이지 번호는 다른 목록과 같은 공통 컴포넌트를 씀 (props 이름·뜻이 같음)
import Pagination from "../../../common/components/Pagination";
import PageHeader from "../../../common/components/PageHeader";
import { badge, btnPrimary, tableCard, td, th, thead } from "../../../common/style";

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
      <PageHeader title="공지사항" description="회사 공지와 필독 사항을 확인하세요." breadcrumb={["공지사항"]}>
        {user?.role == "ADMIN" && isLoggedIn && (
          <Link to="/notices/write" className={btnPrimary}>
            글쓰기
          </Link>
        )}
      </PageHeader>

      {/* Count */}
      <p className="mb-3 text-sm text-slate-500">
        전체 <span className="font-semibold text-slate-900">{total}</span>건
      </p>

      {/* Table */}
      <div className={tableCard}>
        <table className="w-full text-sm">
          <thead className={thead}>
            <tr>
              <th className={`${th} w-20 text-center`}>번호</th>
              <th className={`${th} text-left`}>제목</th>
              <th className={`${th} w-32 text-center`}>작성자</th>
              <th className={`${th} w-32 text-center`}>작성일</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                  공지사항이 없습니다.
                </td>
              </tr>
            )}
            {data.items.map((post) => (
              <tr
                key={post.id}
                // 필독(고정) 공지는 연한 노란 배경으로 구분
                className={post.is_pinned === "Y" ? "bg-amber-50/50 transition hover:bg-amber-50" : "transition hover:bg-slate-50"}
              >
                <td className={`${td} text-center text-slate-400`}>{post.id}</td>

                <td className={td}>
                  <Link
                    to={`/notices/${post.id}?page=${Page}&size=${Size}`}
                    className="font-medium text-slate-800 hover:text-indigo-600"
                  >
                    {post.is_pinned === "Y" && <span className={`${badge} mr-2 bg-amber-100 text-amber-700`}>필독</span>}
                    {post.title}
                  </Link>
                </td>

                <td className={`${td} text-center text-slate-600`}>{post.author.name}</td>

                <td className={`${td} text-center text-slate-400`}>{post.created_at.slice(0, 10)}</td>
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
