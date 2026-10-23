import { Link } from "react-router-dom";
import ApprovalTable from "../components/ApprovalTable";
import useApprovals from "../hooks/useApprovals";
import { useState } from "react";

// 내 문서함: 내 기안 / 승인됨 / 반려됨 탭
const ApprovalList = () => {
  const [listType, setListType] = useState<string>("drafted");
  const { items, loading } = useApprovals(listType);

  if (loading) {
    return <p>로딩중입니다.</p>;
  }

  const changeColor = (type: string) => {
    const base = "border-b-2 px-4 py-2 text-sm";
    if (listType === type) {
      return `${base} border-indigo-600 font-semibold text-indigo-600`;
    }
    return `${base} border-transparent font-medium text-slate-500 hover:text-slate-800`;
  };

  return (
    <div>
      <div className="mb-3 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        <span className="text-slate-600">전자결재</span>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 문서함</h1>
          <p className="mt-1 text-sm text-slate-500">
            내가 올린 문서와 처리가 끝난 문서를 볼 수 있습니다.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/approvals/inbox"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            결재 대기함
          </Link>
          <Link
            to="/approvals/write"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            기안하기
          </Link>
        </div>
      </div>

      {/* Tabs: 나중에 누른 탭에 따라 색을 바꾸고 다른 API를 부름 */}
      <div className="mb-4 flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setListType("drafted")}
          className={`${changeColor("drafted")}`}
        >
          진행중
        </button>
        <button
          onClick={() => setListType("approved")}
          className={`${changeColor("approved")}`}
        >
          승인됨
        </button>
        <button
          onClick={() => setListType("rejected")}
          className={`${changeColor("rejected")}`}
        >
          반려됨
        </button>
      </div>

      <ApprovalTable items={items} />
    </div>
  );
};

export default ApprovalList;
