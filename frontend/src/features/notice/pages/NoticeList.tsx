// 공지사항 전체 화면
// searchParams 를 통해 가져오기
// page, size 정의하고 불러오기
// 로그인 한 유저 중 어드민 권한 가진 유저만 글쓰기 버튼 보이게 하기
// 화면에 보여줄 페이지 개수 제한
// page, size 가져오려면 hooks 먼저 만들기

import { Link, useSearchParams } from "react-router-dom";
import useNotices from "../hooks/useNotices";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../../../common/components/Pagination";
import PageHeader from "../../../common/components/PageHeader";
import { badge, btnPrimary, tableCard, td, th, thead } from "../../../common/style";

const NoticeList = () => {
  // 주소단 파라미터 page,size의 값 가져오기 / 기본값 1,10
  const [searchParams, setSearchParams] = useSearchParams();
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  // 받은 값을 통해 상세데이터 가져오기
  const data = useNotices(Page, Size);
  // 상세데이터 안의 값을 꺼내서 사용
  const { total, total_pages } = data;

  // 로그인확인, 유저(role 확인용)
  const { isLoggedIn, user } = useAuth();
  // Pagination에 넘겨줄 값 정의
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
        {isLoggedIn && user?.role == "ADMIN" && (
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
                className={
                  post.is_pinned === "Y"
                    ? "bg-amber-50/50 transition hover:bg-amber-50"
                    : "transition hover:bg-slate-50"
                }
              >
                <td className={`${td} text-center text-slate-400`}>{post.id}</td>

                <td className={td}>
                  <Link
                    to={`/notices/${post.id}?page=${Page}&size=${Size}`}
                    className="font-medium text-slate-800 hover:text-indigo-600"
                  >
                    {post.is_pinned === "Y" && (
                      <span className={`${badge} mr-2 bg-amber-100 text-amber-700`}>필독</span>
                    )}
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
