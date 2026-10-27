import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../../../common/components/Pagination";
import type { ReservationDetailResponse } from "../types/room";
import { adminDeleteReservation,getAdminReservations } from "../apis/adminRoomApi";
import { toHHMM } from "../utils/time";
import { getErrorMessage, getErrorStatus } from "../utils/error";
import PageHeader from "../../../common/components/PageHeader";
import { btnDangerSm, card, emptyText, td, th, thead } from "../../../common/style";
// 한 페이지에 보여줄 예약 수
const size = 10;

const AdminRoomPage = () => {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [reservations, setReservations] = useState<ReservationDetailResponse[]>([]);
  const [total, setTotal] = useState(0);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 화면에 보여줄 페이지 번호 개수 제한 (AdminUserPage에서 갖고옴)
  const pageSize = 5;
  const startPage = Math.floor((page - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, totalPages);

  const load = useCallback(() => {
    if (user?.role !== "ADMIN") return;
    getAdminReservations(page, size).then((data) => {
      // 마지막 페이지 다 지워서 비면 앞 페이지로
      if (data.items.length === 0 && page > 1){
        setPage(page - 1);
        return;
      } 
      setReservations(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
     });
    }, [user, page]);

     // 예약 목록: 페이지 바뀌면 다시 불러옴
    useEffect(() => {
    load();
    }, [load]);
    
  // 관리자 예약 취소
  const handleCancel = async (id: number) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      const data = await adminDeleteReservation(id);
      setMessage(data.message);
      load();
    } catch (err) {
      setMessage(getErrorMessage(err, "취소 중 오류가 발생했습니다."));
      if (getErrorStatus(err) === 404) load();
    }
  };
  

  if (loading) return null;
  if (user?.role !== "ADMIN") {
    return <p className={emptyText}>관리자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      <PageHeader
        title="회의실 관리"
        description="모든 직원의 회의실 예약을 확인하고 취소할 수 있습니다."
        breadcrumb={["관리자", "회의실 관리"]}
      />

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          전체 <span className="font-semibold text-slate-900">{total}</span>건
        </p>
        {message && <p className="text-xs text-slate-600">{message}</p>}
      </div>

      <div className={`overflow-x-auto ${card}`}>
        <table className="w-full whitespace-nowrap text-sm">
          <thead className={thead}>
            <tr>
              <th className={`${th} text-left`}>날짜</th>
              <th className={`${th} text-left`}>시간</th>
              <th className={`${th} text-left`}>회의실</th>
              <th className={`${th} w-full text-left`}>제목</th>
              <th className={`${th} text-center`}>예약자</th>
              <th className={th}></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {reservations.map((r) => {
              // 끝난 예약은 회색
              const isPast = new Date(r.end_at) < new Date();

              return (
                <tr key={r.id} className={isPast ? "text-slate-400" : "transition hover:bg-slate-50"}>
                  <td className={`${td} tabular-nums`}>{r.start_at.slice(0, 10)}</td>
                  <td className={`${td} font-medium tabular-nums`}>
                    {toHHMM(r.start_at)} ~ {toHHMM(r.end_at)}
                  </td>
                  <td className={td}>{r.room_name}</td>
                  <td className={`${td} max-w-0 truncate`}>{r.title}</td>
                  <td className={`${td} text-center`}>
                    {r.user_name} {r.user_position}
                  </td>
                  {/* 취소 버튼 */}
                  <td className={`${td} text-right`}>
                    {!isPast && (
                        <button type="button" onClick={() => handleCancel(r.id)} className={btnDangerSm}>
                        취소
                        </button>
                    )}
                    </td>
                </tr>
              );
            })}

            {/* 예약 없을때 */}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  예약 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        start={startPage}
        end={endPage}
      />
    </div>
  );
};

export default AdminRoomPage;