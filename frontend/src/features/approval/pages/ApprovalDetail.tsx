import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { putApproval } from "../apis/approvalApi";
import { statusColor, statusLabel } from "../functions/approvalFunction";
import useApprovalDetail from "../hooks/useApprovalDetail";
import { useAuth } from "../../user/context/AuthContext";
import PageHeader from "../../../common/components/PageHeader";
import {
  badge,
  btnDanger,
  btnPrimary,
  btnSecondary,
  card,
  emptyText,
} from "../../../common/style";

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
    return <p className={emptyText}>불러오는 중입니다.</p>;
  }
  if (!items) {
    return <p className={emptyText}>문서를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title="결재 문서" breadcrumb={["전자결재", "문서 보기"]} />

      <article className={card}>
        {/* Header: 제목 + 상태, 아래에 기안자·결재자·날짜 */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{items.title}</h2>
            <span className={`${badge} ${statusColor(items.status)}`}>
              {statusLabel(items.status)}
            </span>
          </div>

          {/* dt(이름표) + dd(값) 한 쌍씩 */}
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-400">기안자</dt>
              <dd className="mt-0.5 font-medium text-slate-700">
                {items.drafter.name} {items.drafter.position}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">결재자</dt>
              <dd className="mt-0.5 font-medium text-slate-700">
                {items.approver.name} {items.approver.position}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">기안일</dt>
              <dd className="mt-0.5 font-medium text-slate-700">
                {items.created_at.slice(0, 10)}
              </dd>
            </div>
            {items.completed_at && (
              <div>
                <dt className="text-xs text-slate-400">결재일</dt>
                <dd className="mt-0.5 font-medium text-slate-700">
                  {items.completed_at.slice(0, 10)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Content */}
        <div className="min-h-48 px-6 py-6 leading-7 text-slate-700">
          <p className="whitespace-pre-wrap">{items.content}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-100 px-6 py-4">
          <button onClick={() => navigate(-1)} className={btnSecondary}>
            목록
          </button>

          <div className="flex gap-2">
            {items.status === "REJECTED" && items.drafter.id === user?.id && (
              <button
                onClick={() => navigate(`/approvals/write?from=${items.id}`)}
                className={btnSecondary}
              >
                재작성
              </button>
            )}

            {items.status === "IN_PROGRESS" &&
              items.approver.id === user?.id && (
                <>
                  <button
                    onClick={() => handleSubmit("REJECTED")}
                    className={btnDanger}
                  >
                    반려
                  </button>
                  <button
                    onClick={() => handleSubmit("APPROVED")}
                    className={btnPrimary}
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
