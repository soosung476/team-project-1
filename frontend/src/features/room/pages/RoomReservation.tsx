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
import { LuMapPin, LuUsers } from "react-icons/lu";
import PageHeader from "../../../common/components/PageHeader";
import { btnPrimary, card, cardHeader, cardTitle, input, tabStyle } from "../../../common/style";

const RoomReservation = () => {
  const { user } = useAuth(); //유저
  const [rooms, setRooms] = useState<MeetingRoomResponse[]>([]); //회의실 
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);   // 예약 등록 
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null); // 회의실 선택
  const [selectedDate, setSelectedDate] = useState<string>(getToday()); // 날짜 선택
  const [slots, setSlots] = useState<RoomSlotResponse[]>([]); // 회의실 시간대 선택
  const [selectedSlots,setSelectedSlots] = useState<string[]>([]); // 선택된 슬롯
  const [title,setTitle] = useState<string>(""); // 회의 주제
  const [submitting, setSubmitting] = useState<boolean>(false); // 전송 
  const [message, setMessage] = useState<string>(""); //메시지 설정 변수
  const [tab, setTab] = useState<"reserve" | "mine">("reserve"); // 탭 예약하기 / 내예약

  // 칸과 겹치는 예약 찾기 (백엔드의 is_overlapping 과 비슷한거임)
  const findReservation = (slot: RoomSlotResponse) =>
    reservations.find(
      (r) => slot.start_at < r.end_at && slot.end_at > r.start_at, //겹침비교
    );
  
  // 회의실 목록 불러오기
  useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
      if (data.length > 0) setSelectedRoomId(data[0].id); //회의실 목록 불러와서 회의 실이 한개 이상 있으면 표시, 첫 번째 회의실이 디폴트
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
    if (selectedRoomId == null || !startAt || !endAt) return; //선택한 회의실이 없으면 return
    if (title.trim() === "") return; // 회의 제목이 비어 있으면 return

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
    // 페이지 높이를 "화면 높이 - (상단바 64px + 위아래 여백 48px)" 으로 고정
    // → 페이지 스크롤 없음. 내부 스크롤은 "시간 목록" 한 곳만
    // (112px 은 AppLayout 높이 기준. 팀 레이아웃이 바뀌면 이 값만 조정)
    // 최소 높이 700px: 화면이 낮아도 오른쪽 회의실 안내 4곳이 잘리지 않는 높이 (그보다 낮은 화면은 페이지가 조금 스크롤됨)
    <div className="flex h-[calc(100vh-112px)] min-h-[700px] flex-col">
      {/* ───────── 제목 ───────── */}
      <div className="shrink-0">
        <PageHeader
          title="회의실 예약"
          description="날짜와 회의실을 고른 뒤, 빈 시간을 눌러 예약하세요."
          breadcrumb={["회의실 예약"]}
        />
      </div>

      {/* 탭 버튼 */}
      <div className="mb-4 flex shrink-0 gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setTab("reserve");
            // 내 예약에서 취소하고 오면 시간표 다시호출
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

      {tab === "reserve" ? (
        /* ───────── 본문: 왼쪽 남는 너비 전부 / 오른쪽 340px 고정 ─────────
           오른쪽을 고정 폭으로 두면 회의실 이름·인원·위치가 한 줄에 다 들어감 */
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px] gap-6">
          {/* ===== 왼쪽: 일별 예약현황 ===== */}
          <section className={`flex min-h-0 flex-col overflow-hidden ${card}`}>
            <div className={cardHeader}>
              <span className={cardTitle}>일별 예약현황</span>
              <span className="text-xs text-slate-500">
                {selectedRoom?.name} · 예약 {reservations.length}건
              </span>
            </div>
            {/* 날짜 선택 + 회의실 선택 (예약현황 영역에서 바로 고름) */}
            <div className="flex shrink-0 items-start gap-3 border-b border-slate-100 px-5 py-3">
              <input
                type="date"
                value={selectedDate}
                min={getToday()}

                onChange={(e) => {
                  setSelectedDate(e.target.value);  // 날짜 선택
                  setSelectedSlots([]); // 회의실 시간대 선택
                  setMessage("");
                }}

                className={`${input} shrink-0`}
              />

              {/* 회의실 선택 칩: 회의실이 많아지면 다음 줄로 넘어감 (옆으로 숨지 않게) */}
              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
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
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                        isActive
                          ? "border-indigo-600 bg-indigo-600 text-white"
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
            <div className={`shrink-0 overflow-hidden ${card}`}>
              <div className={cardHeader}>
                <span className={cardTitle}>회의실 예약등록</span>
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
                  className={input}
                />

                {/* 결과 안내 문구 */}
                {message && (
                  <p className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
                    {message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={btnPrimary}
                >
                  {submitting ? "예약 중..." : "회의실 예약"}
                </button>
              </div>
            </div>

            {/* 회의실 안내: 한 줄에 회의실 하나 (GET /rooms 데이터, 선택 기능 없음)
                이름·위치·인원을 항상 보여주고, 지금 고른 회의실 줄만 남색으로 표시 */}
            <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${card}`}>
              <div className={cardHeader}>
                <span className={cardTitle}>회의실 안내</span>
                <span className="text-xs text-slate-400">{rooms.length}곳</span>
              </div>

              {/* 회의실이 많아서 넘치면 이 목록만 스크롤 */}
              <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto">
                {rooms.map((room) => {
                  const isActive = room.id === selectedRoomId;
                  return (
                    <li
                      key={room.id}
                      className={`flex items-center justify-between gap-3 px-5 py-2.5 ${
                        isActive ? "bg-indigo-50/70" : ""
                      }`}
                    >
                      {/* 왼쪽 이름 / 오른쪽 인원·위치 (한 줄) */}
                      <span
                        className={`truncate text-sm font-medium ${
                          isActive ? "text-indigo-700" : "text-slate-800"
                        }`}
                      >
                        {room.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <LuUsers />
                          {room.capacity}명
                        </span>
                        <span className="flex items-center gap-1">
                          <LuMapPin />
                          {room.location}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
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