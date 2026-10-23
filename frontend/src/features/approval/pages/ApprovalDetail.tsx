import { Link } from "react-router-dom";

// 결재 문서 상세
const ApprovalDetail = () => {
  return (
    <div>
      <div className="mb-3 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        전자결재 <span className="mx-2">/</span>
        <span className="text-slate-600">문서</span>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">제목</h1>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              상태
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
            <span>
              기안자 <span className="font-medium text-slate-600">이름</span>
            </span>
            <span>
              결재자 <span className="font-medium text-slate-600">이름</span>
            </span>
            <span>기안일</span>
            <span>처리일</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-40 px-6 py-5 leading-7 text-slate-700">
          <p className="whitespace-pre-wrap">내용</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-200 px-6 py-3">
          <Link
            to="/approvals"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            목록
          </Link>

          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              재작성
            </button>
            <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
              반려
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              승인
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ApprovalDetail;
