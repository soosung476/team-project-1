import { Link, useSearchParams } from "react-router-dom";
import ApprovalTable from "../components/ApprovalTable";
import useApprovals from "../hooks/useApprovals";
import Pagination from "../../../common/components/Pagination";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import PageHeader from "../../../common/components/PageHeader";
import {
  btnPrimary,
  btnSecondary,
  emptyText,
  input,
  searchBox,
  searchInput,
  tabStyle,
} from "../../../common/style";

// 내 문서함: 내 기안 / 승인됨 / 반려됨 탭
const ApprovalList = () => {
  // 탭·페이지·검색 조건은 주소(?tab=&page=&criteria=&keyword=)에 둠
  // → 상세를 봤다가 뒤로 와도 보던 탭·페이지·검색이 그대로 남음
  const [searchParams, setSearchParams] = useSearchParams();

  const listType = searchParams.get("tab") || "drafted";
  const currentPage = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const criParam = searchParams.get("criteria") || "title";
  const keyParam = searchParams.get("keyword") || "";

  // 검색: 입력창에 고르고 치는 값. 검색 버튼을 눌러야 주소(criParam·keyParam)에 반영됨
  const [criteriaInput, setCriteriaInput] = useState(criParam);
  const [keywordInput, setKeywordInput] = useState(keyParam);

  const { data, loading } = useApprovals(
    listType,
    currentPage,
    size,
    criParam,
    keyParam,
  );
  const { items, total, total_pages } = data;
  const pageSize = 5;
  const startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, total_pages);

  // 탭을 바꾸면 주소에 tab만 남김 → 1페이지, 검색 없음으로 돌아감
  const changeTab = (type: string) => {
    setSearchParams({ tab: type });
    setCriteriaInput("title");
    setKeywordInput("");
  };

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    // 다른 페이지를 보다가 검색해도 결과는 1페이지부터 보여줌
    setSearchParams({
      tab: listType,
      page: "1",
      size: String(size),
      criteria: criteriaInput,
      keyword: keywordInput,
    });
  };

  const onPageChange = (page: number) => {
    // 검색 조건은 입력창 값이 아니라 주소에 있는 값(지금 보고 있는 검색 결과)을 그대로 씀
    setSearchParams({
      tab: listType,
      page: String(page),
      size: String(size),
      criteria: criParam,
      keyword: keyParam,
    });
  };

  return (
    <div>
      <PageHeader
        title="내 문서함"
        description="내가 올린 문서와 처리가 끝난 문서를 볼 수 있습니다."
        breadcrumb={["전자결재", "내 문서함"]}
      >
        <Link to="/approvals/inbox" className={btnSecondary}>
          결재 대기함
        </Link>
        <Link to="/approvals/write" className={btnPrimary}>
          기안하기
        </Link>
      </PageHeader>

      {/* Tabs: 누른 탭 값(tab)을 주소에 넣으면 그 목록을 다시 불러옴 */}
      <div className="mb-4 flex gap-1 border-b border-slate-200">
        <button
          onClick={() => changeTab("drafted")}
          className={tabStyle(listType === "drafted")}
        >
          진행중
        </button>
        <button
          onClick={() => changeTab("approved")}
          className={tabStyle(listType === "approved")}
        >
          승인됨
        </button>
        <button
          onClick={() => changeTab("rejected")}
          className={tabStyle(listType === "rejected")}
        >
          반려됨
        </button>
      </div>

      {/* 왼쪽 전체 개수 / 오른쪽 검색: 어디서 찾을지(criteria) 고르기 + 검색어(keyword) */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          전체 <span className="font-semibold text-slate-900">{total}</span>건
        </p>

        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
          <select
            name="criteria"
            value={criteriaInput}
            onChange={(e) => setCriteriaInput(e.target.value)}
            className={input}
          >
            <option value="title">제목</option>
            <option value="drafter">기안자</option>
            <option value="approver">결재자</option>
          </select>

          <div className={searchBox}>
            <LuSearch />
            <input
              name="keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              type="text"
              placeholder="검색어를 입력하세요"
              className={searchInput}
            />
          </div>
          <button type="submit" className={btnSecondary}>
            검색
          </button>
        </form>
      </div>

      {/* 로딩 중에는 표 자리만 바꿈 → 탭·검색창은 그대로 보임 */}
      {loading ? (
        <p className={emptyText}>불러오는 중입니다.</p>
      ) : (
        <ApprovalTable items={items} />
      )}

      {/* 페이지 번호 */}
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

export default ApprovalList;
