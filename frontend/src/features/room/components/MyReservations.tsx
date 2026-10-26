import { useEffect, useState } from "react";
import type { ReservationDetailResponse } from "../types/room";
import { getMyReservations } from "../apis/roomApi";
import { card, cardHeader } from "../style";

// "2026-11-20T09:30:00" → "09:30"
const toHHMM = (iso: string) => iso.slice(11, 16);

const MyReservations = () => {
  // state, useEffect, 취소 함수
const [myReservations,setMyReservations] = useState<ReservationDetailResponse[]>([]);

useEffect(() => {
  getMyReservations().then((data) => {
    setMyReservations(data);
  });
}, []);

return(
    <div className={`flex min-h-0 flex-1 flex-col ${card}`}>
        <div className={cardHeader}>
        <span className="font-semibold">내 예약</span>
        <span className="text-xs text-slate-500">{myReservations.length}건</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
        {myReservations.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">예약 내역이 없습니다.</p>
        ) : (
        myReservations.map((r) => (
            <div key={r.id} className="flex h-10 items-center gap-3 border-b border-slate-100 px-4 text-sm">
                {/* 날짜 */}
                <span className="w-28 tabular-nums">{r.start_at.slice(0, 10)}</span>

                {/* 시간  */}
                <span className="w-28 font-medium tabular-nums">
                {toHHMM(r.start_at)} ~ {toHHMM(r.end_at)}
                </span>

                {/* 회의실 */}
                <span className="w-32 truncate">{r.room_name}</span>

                {/* 제목 */}
                <span className="flex-1 truncate">{r.title}</span>
            </div>
        
        )))}
        
        </div>
    </div>
    
    );

};

export default MyReservations;