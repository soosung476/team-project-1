import type {
  MeetingRoomResponse,
  ReservationResponse,
  RoomSlotResponse,
} from "../types/room";
import { useEffect, useState } from "react";
import { getRoomReservations, getRooms, getRoomSlots, postReservation } from "../apis/roomApi";
import { useAuth } from "../../user/context/AuthContext";
import MyReservations from "../components/MyReservations";
import { getToday, toHHMM } from "../utils/time";
import { getErrorMessage, getErrorStatus } from "../utils/error";
import { card, cardHeader, tabStyle } from "../style";

const RoomReservation = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<MeetingRoomResponse[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);   
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [slots, setSlots] = useState<RoomSlotResponse[]>([]);
  const [selectedSlots,setSelectedSlots] = useState<string[]>([]);
  const [title,setTitle] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false); 
  const [message, setMessage] = useState<string>("");
  const [tab, setTab] = useState<"reserve" | "mine">("reserve"); // 탭 예약하기 / 내예약

  // 칸과 겹치는 예약 찾기 (백엔드의 is_overlapping 과 비슷한거임)
  const findReservation = (slot: RoomSlotResponse) =>
    reservations.find(
      (r) => slot.start_at < r.end_at && slot.end_at > r.start_at,
    );
  
  // 회의실 목록 불러오기, 첫 번째 회의실이 디폴트
  useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
      if (data.length > 0) setSelectedRoomId(data[0].id);
    });
  }, []);

  // 회의실·날짜가 바뀔 때마다: 예약 목록 다시 불러옴
  useEffect(() => {
    if(selectedRoomId == null) return;

    getRoomReservations(selectedRoomId, selectedDate).then((data) =>{
      setReservations(data);
    });
  }, [selectedRoomId,selectedDate]);

  // 회의실·날짜가 바뀔 때마다: 30분 단위 시간 칸(예약 가능 여부) 다시 불러오기 (회의실 선택 전이면 건너뜀)
  useEffect(() => {
    if(selectedRoomId == null) return;
    getRoomSlots(selectedRoomId,selectedDate).then((data) =>{
      setSlots(data);
    });
  },[selectedRoomId, selectedDate]);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const startAt = selectedSlots[0];                         
  const lastSlot = slots.find((s) => s.start_at === selectedSlots[selectedSlots.length-1] );     // 선택한 마지막 칸 (끝 시간 구할려고)
  const endAt = lastSlot?.end_at;

  // 예약 버튼을 누를 수 있는 상태인지
  const canSubmit =
    selectedRoomId != null && !!startAt && !!endAt && title.trim() !== "" && !submitting;

  // 예약 등록 후 / 409 충돌 후: 지금 회의실·날짜 데이터 다시호출
  const refresh = (roomId: number) => {
    getRoomReservations(roomId, selectedDate).then(setReservations);
    getRoomSlots(roomId, selectedDate).then(setSlots);
  };

  // 예약 등록 
  const handleSubmit = async () => {
    if (selectedRoomId == null || !startAt || !endAt) return;
    if (title.trim() === "") return;

    setSubmitting(true);
    setMessage("");
    try {
      await postReservation({
        room_id: selectedRoomId,
        title: title.trim(),
        start_at: startAt,
        end_at: endAt,
      });
      setMessage("예약이 완료되었습니다.");
      setSelectedSlots([]);
      setTitle("");
      refresh(selectedRoomId);
    } catch (err) {
      // 에러 문구는 utils/error 에서 꺼냄
      setMessage(getErrorMessage(err, "예약 중 오류가 발생했습니다."));
      // 409: 그사이 다른 사람이 먼저 예약함 → 선택 비우고 최신 상태로
      if (getErrorStatus(err) === 409) {
        setSelectedSlots([]);
        refresh(selectedRoomId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // 페이지 높이를 "화면 높이 - (헤더 + 메뉴 + 푸터 + 위아래 여백)" 으로 고정
    // → 페이지 스크롤 없음. 내부 스크롤은 "시간 목록" 한 곳만
    // (172px 은 AppLayout 높이 기준. 팀 레이아웃이 바뀌면 이 값만 조정)
    <div className="flex h-[calc(100vh-172px)] min-h-[540px] flex-col">
      {/* ───────── 제목 ───────── */}
      <div className="mb-4 flex shrink-0 items-end justify-between">
        <div>
          <div className="mb-1 text-sm text-slate-400">
            Home <span className="mx-2">/</span>
            <span className="text-slate-600">회의실</span>
          </div>
          {/* 제목이랑 탭 한줄로 */}
          <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">회의실 예약</h1>
          {/* 탭 버튼 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab("reserve");
                // 내예약에서 취소하고 오면 시간표 다시호출
                if (selectedRoomId != null) refresh(selectedRoomId);
              }}
              className={tabStyle(tab === "reserve")}
            >
              예약하기
            </button>
            <button
              type="button"
              onClick={() => setTab("mine")}
              className={tabStyle(tab === "mine")}
            >
              내 예약
            </button>
          </div>
          </div>
        </div>
      </div>

      {tab === "reserve" ? (
        /* ───────── 본문: 왼쪽 2 / 오른쪽 1 ───────── */
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
          {/* ===== 왼쪽: 일별 예약현황 ===== */}
          <section className={`col-span-2 flex min-h-0 flex-col ${card}`}>
            <div className={cardHeader}>
              <span className="font-semibold">일별 예약현황</span>
              <span className="text-xs text-slate-500">
                {selectedRoom?.name} · 예약 {reservations.length}건
              </span>
            </div>
            {/* 날짜 선택 + 회의실 선택 (예약현황 영역에서 바로 고름) */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-3">
              <input
                type="date"
                value={selectedDate}
                min={getToday()}
                
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlots([]);
                  setMessage("");
                }}
                
                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />

              {/* 회의실 선택 칩: 회의실이 많아지면 이 줄만 가로 스크롤 */}
              <div className="flex min-w-0 gap-2 overflow-x-auto">
                {rooms.map((room) => {
                  const isActive = room.id === selectedRoomId;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setSelectedSlots([]);
                        setMessage("");
                      }}
                      className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {room.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 시간 목록 */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {slots.map((slot) => {
                const reservation = findReservation(slot);
                const isSelected = selectedSlots.includes(slot.start_at);
                const isFirstOfReservation =
                  reservation && reservation.start_at === slot.start_at;

                // 칸 상태별 스타일: 예약됨 / 선택됨 / 지난 칸 / 빈 칸
                const rowStyle = reservation
                  ? "border-l-4 border-l-indigo-500 bg-indigo-50"
                  : isSelected
                    ? "border-l-4 border-l-emerald-500 bg-emerald-50"
                    : !slot.available
                      ? "bg-slate-100 text-slate-400"
                      : "hover:bg-slate-50";

                return (
                  <div
                    key={slot.start_at}
                    onClick={() => {
                        if(reservation || !slot.available) return;

                        if (isSelected) {                     
                          setSelectedSlots([]);
                        } else if (slot.start_at === endAt) {    
                          setSelectedSlots([...selectedSlots, slot.start_at]);
                        } else if (slot.end_at === startAt) {      
                          setSelectedSlots([slot.start_at, ...selectedSlots]);
                        } else {                              
                          setSelectedSlots([slot.start_at]);
                        }
                      }
                    }
                    className={`flex h-10 items-center gap-3 border-b border-l-4 border-slate-100 border-l-transparent px-4 text-sm ${rowStyle}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!!reservation || !slot.available}
                      readOnly
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span className="w-28 font-medium tabular-nums">
                      {toHHMM(slot.start_at)} ~ {toHHMM(slot.end_at)}
                    </span>

                    {reservation &&
                      (isFirstOfReservation ? (
                        <span className="truncate">
                          <span className="font-semibold text-indigo-700">
                            {reservation.title}
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            / {reservation.user_name} {reservation.user_position}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-indigo-400">└ 예약 중</span>
                      ))}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 오른쪽: 내부 스크롤 없음 ===== */}
          <aside className="flex min-h-0 flex-col gap-6">
            {/* 예약 등록 */}
            <div className={`shrink-0 ${card}`}>
              <div className={cardHeader}>
                <span className="font-semibold">회의실 예약등록</span>
              </div>

              <div className="flex flex-col gap-3 p-5 text-sm">
                {/* 선택 내용 요약 (읽기 전용) */}
                <dl className="grid grid-cols-[4rem_1fr] gap-x-3 gap-y-1.5 rounded-lg bg-slate-50 px-4 py-3">
                  <dt className="text-slate-500">예약자</dt>
                  <dd>{user?.name ?? "-"}</dd>
                  <dt className="text-slate-500">회의실</dt>
                  <dd>{selectedRoom?.name}</dd>
                  <dt className="text-slate-500">시간</dt>
                  <dd className="font-semibold text-emerald-700 tabular-nums">
                    {startAt && endAt
                      ? `${selectedDate} ${toHHMM(startAt)} ~ ${toHHMM(endAt)}`
                      : "시간을 선택하세요"}
                  </dd>
                </dl>

                {/* 제목: 예약 테이블 title 컬럼 (필수, 최대 100자) */}
                <input
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="회의 제목을 입력하세요 (필수)"
                  className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500"
                />
                
                {/* 결과 안내 문구 */}
                {message && (
                  <p className="text-xs text-slate-600">{message}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? "예약 중..." : "회의실 예약"}
                </button>
              </div>
            </div>

            {/* 회의실 안내: 2 × 2 카드 (GET /rooms 데이터, 선택 기능 없음)
                평소엔 이름만, 마우스를 올리면 커지면서 인원·위치 표시 */}
            <div className={`flex min-h-0 flex-1 flex-col ${card}`}>
              <div className={cardHeader}>
                <span className="font-semibold">회의실 안내</span>
                <span className="text-xs text-slate-400">
                  마우스를 올리면 상세 정보
                </span>
              </div>

              {/* 화면이 크면 카드가 남은 높이만큼 커지고, 작으면 최소 높이 유지 → 내부 스크롤 없음 */}
              <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-4">
                {rooms.map((room) => {
              return (
              <div
                  key={room.id}
                  // group: 안쪽 요소가 "카드에 마우스가 올라왔는지"를 알 수 있게 함
                  className="group relative flex min-h-16 cursor-default flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-3 transition duration-200 hover:z-10 hover:scale-105 hover:shadow-md"
              >
                  <span className="text-sm font-semibold text-slate-800">
                        {room.name}
                      </span>
                      {/* 평소엔 숨김 → 카드에 마우스를 올리면 표시 */}
                      <span className="hidden text-xs text-slate-500 group-hover:block">
                        {room.capacity}명 · {room.location}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <MyReservations />
      )}  
    </div>
  );
};

export default RoomReservation;