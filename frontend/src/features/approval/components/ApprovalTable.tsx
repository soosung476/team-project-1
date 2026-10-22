import { Link } from "react-router-dom";
import type { ApprovalListItem } from "../types/approval";

// 결재 목록 표 (결재 대기·내 기안·승인됨·반려됨 화면이 같이 씀)
const ApprovalTable = ({ items }: { items: ApprovalListItem[] }) => {
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
          {}
          <tr className="transition hover:bg-slate-50">
            <td className="px-6 py-2.5 text-center text-slate-400">1</td>
            <td className="px-6 py-2.5">
              <Link
                to="/approvals/1"
                className="font-medium text-slate-800 hover:text-indigo-600"
              >
                제목 자리
              </Link>
            </td>
            <td className="px-6 py-2.5 text-center text-slate-500">
              기안자 (사원)
            </td>
            <td className="px-6 py-2.5 text-center text-slate-500">
              결재자 (팀장)
            </td>
            <td className="px-6 py-2.5 text-center">
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                진행중
              </span>
            </td>
            <td className="px-6 py-2.5 text-center text-slate-400">
              2026-10-22
            </td>
          </tr>
        </tbody>
      </table>

      {/* 목록이 비었을 때 보여줄 문구 */}
      <p className="py-10 text-center text-sm text-slate-400">
        문서가 없습니다.
      </p>
    </div>
  );
};

export default ApprovalTable;
