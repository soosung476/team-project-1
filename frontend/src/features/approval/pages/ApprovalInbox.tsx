import { Link } from "react-router-dom";
import ApprovalTable from "../components/ApprovalTable";
import useApprovals from "../hooks/useApprovals";

// 결재 대기함: 내가 결재자이고 아직 처리 안 한 문서
const ApprovalInbox = () => {
  const { items, loading } = useApprovals("pending");

  if (loading) {
    return <p>로딩중입니다.</p>;
  }

  return (
    <div>
      <div className="mb-3 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        전자결재 <span className="mx-2">/</span>
        <span className="text-slate-600">결재 대기함</span>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">결재 대기함</h1>
          <p className="mt-1 text-sm text-slate-500">
            내가 승인·반려해야 하는 문서입니다.
          </p>
        </div>

        <Link
          to="/approvals"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          내 문서함
        </Link>
      </div>

      <ApprovalTable items={items} />
    </div>
  );
};

export default ApprovalInbox;
