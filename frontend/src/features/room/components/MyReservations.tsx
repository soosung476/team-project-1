import { useEffect, useState } from "react";
import type { ReservationDetailResponse } from "../types/room";
import { deleteReservation, getMyReservations } from "../apis/roomApi";
import { card, cardHeader } from "../style";
import { getErrorMessage, getErrorStatus } from "../utils/error";

// "2026-11-20T09:30:00" → "09:30"
const toHHMM = (iso: string) => iso.slice(11, 16);

// 한 페이지에 보여줄 개수
const PAGE_SIZE = 10;

// 페이지 버튼 스타일 (회의실 칩이랑 비슷하게)
const pageBtn = (active: boolean) =>
  `min-w-8 rounded-md border px-2 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
  }`;

const MyReservations = () => {
  const [myReservations, setMyReservations] = useState<ReservationDetailResponse[]>([]);
  const [message, setMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // 목록 불러오는 함수
  const load = () => {
    getMyReservations().then(setMyReservations);
  };

  useEffect(() => {
    load();
  }, []);

  // 페이징 계산
  const totalPages = Math.max(1, Math.ceil(myReservations.length / PAGE_SIZE));
  // 마지막 페이지에서 취소해서 페이지가 줄어들면 마지막 페이지로
  const currentPage = Math.min(page, totalPages);
  const pageItems = myReservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 예약 취소
  const handleCancel = async (id: number) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;

    try {
      const data = await deleteReservation(id);
      setMessage(data.message);
      load(); // 취소하고 목록 다시호출
    } catch (err) {
      setMessage(getErrorMessage(err, "취소 중 오류가 발생했습니다."));
      // 404 뜨면 목록 다시호출
      if (getErrorStatus(err) === 404) {
        load();
      }
    }
  };

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${card}`}>
      <div className={cardHeader}>
        <span className="font-semibold">내 예약</span>
        <span className="text-xs text-slate-500">{myReservations.length}건</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {myReservations.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">예약 내역이 없습니다.</p>
        ) : (
          pageItems.map((r) => {
            // 끝난 예약 -> 지난건 회색으로 바꾸고 취소버튼 숨김
            const isPast = new Date(r.end_at) < new Date();

            return (
              <div
                key={r.id}
                className={`flex h-10 items-center gap-3 border-b border-slate-100 px-4 text-sm ${isPast ? "text-slate-400" : ""}`}
              >
                {/* 날짜 */}
                <span className="w-28 tabular-nums">{r.start_at.slice(0, 10)}</span>

                {/* 시간 */}
                <span className="w-28 font-medium tabular-nums">
                  {toHHMM(r.start_at)} ~ {toHHMM(r.end_at)}
                </span>

                {/* 회의실 */}
                <span className="w-32 truncate">{r.room_name}</span>

                {/* 제목 */}
                <span className="flex-1 truncate">{r.title}</span>

                {/* 취소 */}
                {!isPast && (
                  <button
                    type="button"
                    onClick={() => handleCancel(r.id)}
                    className="shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    취소
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {message && <p className="px-5 py-2 text-xs text-slate-600">{message}</p>}

      {/* 페이지 버튼 (1페이지 넘을때만) */}
      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-1 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={pageBtn(false)}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={pageBtn(n === currentPage)}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={pageBtn(false)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MyReservations;