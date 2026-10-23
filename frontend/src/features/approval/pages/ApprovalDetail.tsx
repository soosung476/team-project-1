import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { putApproval } from "../apis/approvalApi";
import { statusColor, statusLabel } from "../functions/approvalFunction";
import useApprovalDetail from "../hooks/useApprovalDetail";
import { useAuth } from "../../user/context/AuthContext";

// 결재 문서 상세
const ApprovalDetail = () => {
  const { id } = useParams();
  const detail = useApprovalDetail(Number(id));
  const { items, loading, refresh } = detail;
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (status: string) => {
    if (
      !confirm(
        status === "APPROVED" ? "승인하시겠습니까?" : "반려하시겠습니까?",
      )
    ) {
      return;
    }
    try {
      await putApproval(Number(id), {
        status: status,
      });
      refresh();
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };
  if (loading) {
    return <p>로딩중입니다.</p>;
  }
  if (!items) {
    return <p>문서를 찾을 수 없습니다.</p>;
  }

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
            <h1 className="text-xl font-bold">{items.title}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(items.status)}`}
            >
              {statusLabel(items.status)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
            <span>
              기안자{" "}
              <span className="font-medium text-slate-600">
                {items.drafter.name}
              </span>
            </span>
            <span>
              결재자{" "}
              <span className="font-medium text-slate-600">
                {items.approver.name}
              </span>
            </span>
            <span>
              기안일{" "}
              <span className="font-medium text-slate-600">
                {items.created_at.slice(0, 10)}
              </span>
            </span>
            {items.completed_at && (
              <span>
                결재일{" "}
                <span className="font-medium text-slate-600">
                  {items.completed_at.slice(0, 10)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-40 px-6 py-5 leading-7 text-slate-700">
          <p className="whitespace-pre-wrap">{items.content}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-200 px-6 py-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            목록
          </button>

          <div className="flex gap-2">
            {items.status === "REJECTED" && items.drafter.id === user?.id && (
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                재작성
              </button>
            )}

            {items.status === "IN_PROGRESS" &&
              items.approver.id === user?.id && (
                <>
                  <button
                    onClick={() => handleSubmit("REJECTED")}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                  >
                    반려
                  </button>
                  <button
                    onClick={() => handleSubmit("APPROVED")}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    승인
                  </button>
                </>
              )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ApprovalDetail;
