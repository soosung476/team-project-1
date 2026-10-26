import { Link } from "react-router-dom";
import type { ApprovalListItem } from "../types/approval";
import { statusColor, statusLabel } from "../functions/approvalFunction";
import { useAuth } from "../../user/context/AuthContext";

// 결재 목록 표 (결재 대기·내 기안·승인됨·반려됨 화면이 같이 씀)

const ApprovalTable = ({ items }: { items: ApprovalListItem[] }) => {
  const { user } = useAuth();
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="w-20 px-6 py-2.5 text-center font-medium text-slate-500">
              번호
            </th>
            <th className="px-6 py-2.5 text-left font-medium text-slate-500">
              제목
            </th>
            <th className="w-32 px-6 py-2.5 text-center font-medium text-slate-500">
              기안자
            </th>
            <th className="w-32 px-6 py-2.5 text-center font-medium text-slate-500">
              결재자
            </th>
            <th className="w-24 px-6 py-2.5 text-center font-medium text-slate-500">
              상태
            </th>
            <th className="w-32 px-6 py-2.5 text-center font-medium text-slate-500">
              기안일
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                목록이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-2.5 text-center text-slate-400">
                  {item.id}
                </td>
                <td className="px-6 py-2.5">
                  <Link
                    to={`/approvals/${item.id}`}
                    className="font-medium text-slate-800 hover:text-indigo-600"
                  >
                    {item.title}{" "}
                    {item.drafter.id === user?.id &&
                      item.status === "REJECTED" && (
                        <span className="rounded-full  px-2 py-0.5 text-xs font-medium text-amber-600 bg-amber-50">
                          재작성 가능
                        </span>
                      )}
                  </Link>
                </td>
                <td className="px-6 py-2.5 text-center text-slate-500">
                  {item.drafter.name} ({item.drafter.position})
                </td>
                <td className="px-6 py-2.5 text-center text-slate-500">
                  {item.approver.name} ({item.approver.position})
                </td>
                <td className="px-6 py-2.5 text-center">
                  <span
                    className={`rounded-full  px-2 py-0.5 text-xs font-medium ${statusColor(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className="px-6 py-2.5 text-center text-slate-400">
                  {item.created_at.slice(0, 10)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;
