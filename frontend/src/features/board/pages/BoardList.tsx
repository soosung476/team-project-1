import { Link, useSearchParams } from "react-router-dom";
import useBoards from "../hooks/useBoards";
import Pagination from "../../../common/components/Pagination";
import { useAuth } from "../../user/context/AuthContext";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import PageHeader from "../../../common/components/PageHeader";
import {
  btnPrimary,
  btnSecondary,
  card,
  emptyText,
  input,
  searchBox,
  searchInput,
  tableCard,
  td,
  th,
  thead,
} from "../../../common/style";

const BoardList = () => {
  // 서버로 데이터 요청
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const criParam = searchParams.get("criteria") || "tc";
  const keyParam = searchParams.get("keyword") || "";
  const { data, loading } = useBoards(currentPage, size, criParam, keyParam);
  const { total, total_pages } = data;
  const { isLoggedIn } = useAuth();
  // 화면에 보여줄 페이지개수 제한
  const pageSize = 5;
  const startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, total_pages);

  // 검색
  const [searchForm, setSearchForm] = useState({ criteria: criParam, keyword: keyParam });
  const { criteria, keyword } = searchForm;
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색 버튼
  const onSearchClick = () => {
    setSearchParams({
      page: "1",
      size: String(size),
      criteria: searchForm.criteria,
      keyword: searchForm.keyword,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      onSearchClick();
    }
  };
  const onPageChange = (page: number) => {
    setSearchParams({
      page: String(page),
      size: String(size),
      criteria,
      keyword,
    });
  };

  // 검색 버튼 클릭 시
  const onSeachClick = () => {
    setSearchParams({
      page: "1",
      size: String(size),
      criteria,
      keyword,
    });
  };

  if (!isLoggedIn) {
    return (
      <div>
        <PageHeader title="자유게시판" description="다양한 이야기를 자유롭게 나눠보세요." breadcrumb={["게시판"]} />
        <div className={`${card} p-12 text-center`}>
          <p className="text-slate-600">로그인이 필요합니다.</p>
          <Link to="/users/signin" className={`${btnPrimary} mt-4`}>
            로그인하러 가기
          </Link>
        </div>
      </div>
    );
  }

  // 불러오는 중(loading)에는 아래 표 자리만 바꿈 → 제목·검색창은 그대로 보여서 화면이 깜빡이지 않음
  return (
    <div>
      <PageHeader title="자유게시판" description="다양한 이야기를 자유롭게 나눠보세요." breadcrumb={["게시판"]}>
        {isLoggedIn && (
          <Link to="/boards/write" className={btnPrimary}>
            글쓰기
          </Link>
        )}
      </PageHeader>

      {/* 왼쪽 전체 개수 / 오른쪽 검색 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          전체 <span className="font-semibold text-slate-900">{total}</span>건
        </p>

        <div className="flex w-full max-w-md gap-2">
          <select value={criteria} name="criteria" onChange={onSearchChange} className={input}>
            <option value={"tc"}>제목 + 내용</option>
            <option value={"t"}>제목</option>
            <option value={"w"}>작성자</option>
          </select>

          <div className={searchBox}>
            <LuSearch />
            <input
              value={keyword}
              name="keyword"
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
              type="text"
              placeholder="검색어를 입력하세요"
              className={searchInput}
            />
          </div>

          <button onClick={onSeachClick} className={btnSecondary}>
            검색
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className={emptyText}>불러오는 중입니다.</p>
      ) : (
        <div className={tableCard}>
          <table className="w-full text-sm">
            <thead className={thead}>
              <tr>
                <th className={`${th} w-20 text-center`}>번호</th>

                <th className={`${th} text-left`}>제목</th>

                <th className={`${th} w-32 text-center`}>작성자</th>

                <th className={`${th} w-32 text-center`}>작성일</th>

                <th className={`${th} w-24 text-center`}>조회</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
              {data.items.map((post) => (
                <tr key={post.id} className="transition hover:bg-slate-50">
                  <td className={`${td} text-center text-slate-400`}>{post.id}</td>

                  <td className={td}>
                    <Link
                      to={`/boards/${post.id}?page=${currentPage}&size=${size}`}
                      className="font-medium text-slate-800 hover:text-indigo-600"
                    >
                      {post.title}
                    </Link>
                  </td>

                  <td className={`${td} text-center text-slate-600`}>{post.author.name}</td>

                  <td className={`${td} text-center text-slate-400`}>{post.created_at.slice(0, 10)}</td>

                  <td className={`${td} text-center text-slate-400`}>{post.view_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={total_pages}
        onPageChange={onPageChange}
        start={startPage}
        end={endPage}
      />
    </div>
  );
};

export default BoardList;
