import { Link } from "react-router-dom";
import type { ApprovalListItem } from "../types/approval";
import { statusColor, statusLabel } from "../functions/approvalFunction";
import { useAuth } from "../../user/context/AuthContext";
import { badge, tableCard, td, th, thead } from "../../../common/style";

// 결재 목록 표 (결재 대기·내 기안·승인됨·반려됨 화면이 같이 씀)

const ApprovalTable = ({ items }: { items: ApprovalListItem[] }) => {
  const { user } = useAuth();
  // 승인됨·반려됨 목록은 결재일(completed_at) 순서로 오므로,
  // 처리 끝난 문서가 하나라도 있으면 결재일 칸도 보여줌 (기안일만 있으면 순서가 뒤섞여 보임)
  const showCompleted = items.some((item) => item.completed_at !== null);
  return (
    <div className={tableCard}>
      <table className="w-full text-sm">
        <thead className={thead}>
          <tr>
            {/* 제목 칸이 남는 너비를 모두 쓰도록 나머지 칸은 내용에 맞는 폭으로 고정 */}
            <th className={`${th} w-16 text-center`}>번호</th>
            <th className={`${th} text-left`}>제목</th>
            <th className={`${th} w-28 text-center`}>기안자</th>
            <th className={`${th} w-28 text-center`}>결재자</th>
            <th className={`${th} w-20 text-center`}>상태</th>
            <th className={`${th} w-28 text-center`}>기안일</th>
            {showCompleted && <th className={`${th} w-28 text-center`}>결재일</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                문서가 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50">
                <td className={`${td} text-center text-slate-400`}>{item.id}</td>
                <td className={td}>
                  <Link
                    to={`/approvals/${item.id}`}
                    className="font-medium text-slate-800 hover:text-indigo-600"
                  >
                    {item.title}{" "}
                    {item.drafter.id === user?.id &&
                      item.status === "REJECTED" && (
                        <span className={`${badge} ml-1 bg-amber-50 text-amber-700`}>
                          재작성 가능
                        </span>
                      )}
                  </Link>
                </td>
                <td className={`${td} text-center text-slate-600`}>
                  {item.drafter.name}{" "}
                  <span className="text-slate-400">{item.drafter.position}</span>
                </td>
                <td className={`${td} text-center text-slate-600`}>
                  {item.approver.name}{" "}
                  <span className="text-slate-400">{item.approver.position}</span>
                </td>
                <td className={`${td} text-center`}>
                  <span className={`${badge} ${statusColor(item.status)}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className={`${td} text-center text-slate-400`}>
                  {item.created_at.slice(0, 10)}
                </td>
                {showCompleted && (
                  <td className={`${td} text-center text-slate-600`}>
                    {item.completed_at ? item.completed_at.slice(0, 10) : "-"}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;
