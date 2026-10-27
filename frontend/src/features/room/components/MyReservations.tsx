import { useCallback, useEffect, useState } from "react";
import type { ReservationDetailResponse } from "../types/room";
import { deleteReservation, getReservations } from "../apis/roomApi";
import { btnDangerSm, card, cardHeader, emptyText, segmentStyle } from "../../../common/style";
import { getErrorMessage, getErrorStatus } from "../utils/error";
import { useAuth } from "../../user/context/AuthContext";


// "2026-11-20T09:30:00" → "09:30"
const toHHMM = (iso: string) => iso.slice(11, 16);

// 끝난 예약인지
const isPastReservation = (r: ReservationDetailResponse) =>
  new Date(r.end_at) < new Date();

// 한 페이지에 보여줄 개수
const PAGE_SIZE = 10;

// 페이지 버튼 스타일 (공통 Pagination과 같은 모양: 지금 페이지만 남색)
const pageBtn = (active: boolean) =>
  `h-8 min-w-8 rounded-md px-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? "bg-indigo-600 text-white"
      : "text-slate-600 hover:bg-slate-100"
  }`;

const MyReservations = () => {
  const { user } = useAuth();
  const [myReservations, setMyReservations] = useState<ReservationDetailResponse[]>([]);
  const [message, setMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [scope, setScope] = useState<"mine" | "all">("mine");

  // 목록 불러오는 함수
  const load = useCallback(() => {
    getReservations(scope).then((data) => {
    // 다가오는 예약
    const upcoming = data.filter((r) => !isPastReservation(r));
    // 지난 예약이면 순서 뒤집음
    const past = data.filter((r) => isPastReservation(r)).reverse();
    setMyReservations([...upcoming, ...past]);
    });
  }, [scope]);

  useEffect(() => {
    load();
  }, [load]);


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
    <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${card}`}>
      <div className={cardHeader}>
        {/* 내 예약 / 전체 예약 토글: 회색 틀 안에서 고른 쪽만 흰색 */}
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setScope("mine");
              setPage(1);
              setMessage("");
            }}
            className={segmentStyle(scope === "mine")}
          >
            내 예약
          </button>
          <button
            type="button"
            onClick={() => {
              setScope("all");
              setPage(1);
              setMessage("");
            }}
            className={segmentStyle(scope === "all")}
          >
            전체 예약
          </button>
        </div>
        <span className="text-xs text-slate-500">{myReservations.length}건</span>
      </div>

      {/* 칸 제목: 아래 줄들과 같은 너비(w-28 …)로 맞춤 */}
      {myReservations.length > 0 && (
        <div className="flex h-9 shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold text-slate-500">
          <span className="w-28">날짜</span>
          <span className="w-28">시간</span>
          <span className="w-32">회의실</span>
          {scope === "all" && <span className="w-24">예약자</span>}
          <span className="flex-1">제목</span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {myReservations.length === 0 ? (
          <p className={emptyText}>예약 내역이 없습니다.</p>
        ) : (
          pageItems.map((r) => {
            // 끝난 예약 -> 지난건 회색으로 바꾸고 취소버튼 숨김
            const isPast = isPastReservation(r);

            return (
              <div
                key={r.id}
                className={`flex h-11 items-center gap-3 border-b border-slate-100 px-5 text-sm ${isPast ? "text-slate-400" : ""}`}
              >
                {/* 날짜 */}
                <span className="w-28 tabular-nums">{r.start_at.slice(0, 10)}</span>

                {/* 시간 */}
                <span className="w-28 font-medium tabular-nums">
                  {toHHMM(r.start_at)} ~ {toHHMM(r.end_at)}
                </span>

                {/* 회의실 */}
                <span className="w-32 truncate">{r.room_name}</span>

                {scope === "all" && <span className="w-24 truncate">{r.user_name} {r.user_position}</span>}

                {/* 제목 */}
                <span className="flex-1 truncate">{r.title}</span>

                {/* 취소 */}
                {!isPast && r.user_id === user?.id && (
                  <button
                    type="button"
                    onClick={() => handleCancel(r.id)}
                    className={`${btnDangerSm} shrink-0`}
                  >
                    취소
                  </button>
                )}
                {/* 끝난 예약은 취소 버튼 대신 이유를 글자로 */}
                {isPast && <span className="shrink-0 text-xs">지난 예약</span>}
              </div>
            );
          })
        )}
      </div>

      {message && (
        <p className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-700">{message}</p>
      )}

      {/* 페이지 버튼 (1페이지 넘을때만) */}
      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-1 border-t border-slate-100 px-5 py-3">
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