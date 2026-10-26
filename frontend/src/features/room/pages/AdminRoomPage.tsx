import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../user/context/AuthContext";
import Pagination from "../../../common/components/Pagination";
import type { ReservationDetailResponse } from "../types/room";
import { adminDeleteReservation,getAdminReservations } from "../apis/adminRoomApi";
import { toHHMM } from "../utils/time";
import { getErrorMessage, getErrorStatus } from "../utils/error";
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
    return <p className="text-slate-500">관리자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">회의실 관리</h1>
        <span className="text-sm text-slate-500">전체 {total}건</span>
      </div>
      {message && <p className="mb-2 text-xs text-slate-600">{message}</p>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full whitespace-nowrap text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">날짜</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">시간</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">회의실</th>
              <th className="w-full px-4 py-2.5 text-left font-medium text-slate-500">제목</th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-500">예약자</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {reservations.map((r) => {
              // 끝난 예약은 회색
              const isPast = new Date(r.end_at) < new Date();

              return (
                <tr key={r.id} className={isPast ? "text-slate-400" : ""}>
                  <td className="px-4 py-2.5 tabular-nums">{r.start_at.slice(0, 10)}</td>
                  <td className="px-4 py-2.5 font-medium tabular-nums">
                    {toHHMM(r.start_at)} ~ {toHHMM(r.end_at)}
                  </td>
                  <td className="px-4 py-2.5">{r.room_name}</td>
                  <td className="max-w-0 truncate px-4 py-2.5">{r.title}</td>
                  <td className="px-4 py-2.5 text-center">
                    {r.user_name} {r.user_position}
                  </td>
                  {/* 취소 버튼 */}
                  <td className="px-4 py-2.5 text-right">
                    {!isPast && (
                        <button type="button" onClick={() => handleCancel(r.id)} className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
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
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
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