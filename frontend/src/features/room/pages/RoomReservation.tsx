import type {
  MeetingRoomResponse,
  ReservationResponse,
  RoomSlotResponse,
} from "../types/room";

// ─────────────────────────────────────────────
// 디자인 확인용 가짜 데이터 (다음 태스크에서 API 데이터로 교체)
// ─────────────────────────────────────────────
const fakeDate = "2026-11-20";

// GET /rooms 응답 모양
const fakeRooms: MeetingRoomResponse[] = [
  { id: 1, name: "대회의실", capacity: 12, location: "5층 동쪽" },
  { id: 2, name: "소회의실 1", capacity: 4, location: "5층 서쪽" },
  { id: 3, name: "소회의실 2", capacity: 4, location: "5층 서쪽" },
  { id: 4, name: "포커스룸", capacity: 2, location: "4층 라운지 옆" },
];

// GET /rooms/{id}/reservations?date= 응답 모양
const fakeReservations: ReservationResponse[] = [
  {
    id: 11,
    title: "주간 회의",
    start_at: `${fakeDate}T11:00:00`,
    end_at: `${fakeDate}T11:30:00`,
    user_name: "김민재",
    user_position: "사원",
  },
  {
    id: 12,
    title: "분기 보고",
    start_at: `${fakeDate}T14:00:00`,
    end_at: `${fakeDate}T15:30:00`,
    user_name: "이사원",
    user_position: "사원",
  },
];

// GET /rooms/{id}/slots?date= 응답 모양 (08:00 ~ 20:00, 30분 × 24칸)
const pad = (n: number) => String(n).padStart(2, "0");
const fakeSlots: RoomSlotResponse[] = Array.from({ length: 24 }, (_, i) => {
  const startMin = 8 * 60 + i * 30;
  const endMin = startMin + 30;
  const toIso = (m: number) =>
    `${fakeDate}T${pad(Math.floor(m / 60))}:${pad(m % 60)}:00`;
  return { start_at: toIso(startMin), end_at: toIso(endMin), available: true };
});

// 화면 확인용: 사용자가 09:00, 09:30 칸을 골랐다고 가정
const fakeSelected = [`${fakeDate}T09:00:00`, `${fakeDate}T09:30:00`];

// "2026-11-20T09:30:00" → "09:30"
const toHHMM = (iso: string) => iso.slice(11, 16);

// 칸과 겹치는 예약 찾기 (백엔드 is_overlapping 과 같은 규칙)
const findReservation = (slot: RoomSlotResponse) =>
  fakeReservations.find(
    (r) => slot.start_at < r.end_at && slot.end_at > r.start_at,
  );

const RoomReservation = () => {
  const selectedRoom = fakeRooms[2];

  // 카드 박스 공통 스타일 (팀 디자인 확정 시 여기만 바꾸면 됨)
  const card = "overflow-hidden rounded-xl border border-slate-200 bg-white";
  const cardHeader =
    "flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3";

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
          <h1 className="text-2xl font-bold tracking-tight">회의실 예약</h1>
        </div>
        <p className="text-sm text-slate-500">
          08:00 ~ 20:00 · 30분 단위 · 지난 시간은 예약할 수 없어요
        </p>
      </div>

      {/* ───────── 본문: 왼쪽 2 / 오른쪽 1 ───────── */}
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
        {/* ===== 왼쪽: 일별 예약현황 ===== */}
        <section className={`col-span-2 flex min-h-0 flex-col ${card}`}>
          <div className={cardHeader}>
            <span className="font-semibold">일별 예약현황</span>
            <span className="text-xs text-slate-500">
              {selectedRoom.name} · 예약 {fakeReservations.length}건
            </span>
          </div>

          {/* 날짜 선택 + 회의실 선택 (현황 영역에서 바로 고름) */}
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-3">
            <input
              type="date"
              defaultValue={fakeDate}
              className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />

            {/* 회의실 선택 칩: 회의실이 많아지면 이 줄만 가로 스크롤 */}
            <div className="flex min-w-0 gap-2 overflow-x-auto">
              {fakeRooms.map((room) => {
                const isActive = room.id === selectedRoom.id;
                return (
                  <button
                    key={room.id}
                    type="button"
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

          {/* 시간 목록: 이 페이지에서 유일하게 내부 스크롤이 있는 곳 */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {fakeSlots.map((slot) => {
              const reservation = findReservation(slot);
              const isSelected = fakeSelected.includes(slot.start_at);
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
                  className={`flex h-10 items-center gap-3 border-b border-slate-100 px-4 text-sm ${rowStyle}`}
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
                <dd>김민재 (사원)</dd>
                <dt className="text-slate-500">회의실</dt>
                <dd>{selectedRoom.name}</dd>
                <dt className="text-slate-500">시간</dt>
                <dd className="font-semibold text-emerald-700 tabular-nums">
                  {fakeDate} 09:00 ~ 10:00
                </dd>
              </dl>

              {/* 제목: 예약 테이블 title 컬럼 (필수, 최대 100자) */}
              <input
                type="text"
                maxLength={100}
                placeholder="회의 제목을 입력하세요 (필수)"
                className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                className="rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
              >
                회의실 예약
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
              {fakeRooms.map((room) => {
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
    </div>
  );
};

export default RoomReservation;
