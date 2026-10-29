// 팀 공통 디자인 — 카드·버튼·입력창·표·탭 모양을 한곳에 모음
// 화면마다 className을 따로 쓰면 조금씩 달라지므로(rounded-lg/xl, py-2/2.5 …) 아래 값을 가져다 씀
//   예) className={btnPrimary}
// 너비처럼 여기 없는 클래스만 덧붙임: className={`${btnPrimary} w-full`}
//   (px·py처럼 이미 들어 있는 종류를 또 붙이면 둘 중 어느 쪽이 적용될지 알 수 없음)

// ───────── 카드(흰 상자) ─────────
export const card = "rounded-xl border border-slate-200 bg-white shadow-xs";
// 카드 윗줄: 왼쪽 제목 + 오른쪽 링크·버튼
export const cardHeader =
  "flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3";
export const cardTitle = "text-sm font-semibold text-slate-900";

// ───────── 버튼 ─────────
// 모든 버튼에 border를 넣어(primary는 투명) 나란히 놓아도 높이가 같음
// 주 버튼(저장·작성·승인처럼 화면에서 가장 중요한 동작 하나)
export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300";
// 보조 버튼(목록·취소·수정)
export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50";
// 위험 버튼(삭제·반려): 빨간 글자 + 테두리. 누르면 confirm()으로 한 번 더 물어봄
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50";

// 표 한 줄 안에 들어가는 작은 버튼
export const btnPrimarySm =
  "inline-flex items-center justify-center gap-1 rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300";
export const btnSecondarySm =
  "inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50";
export const btnDangerSm =
  "inline-flex items-center justify-center gap-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50";

// ───────── 입력창 ─────────
// input·textarea·select 공통 (너비는 화면에서 w-full 등으로 붙임)
export const input =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400";
// 표 한 줄 안에 들어가는 작은 입력창·select
export const inputSm =
  "rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400";
// 입력창 위 제목
export const label = "mb-1.5 block text-sm font-medium text-slate-700";

// 검색창: 바깥 상자(searchBox) 안에 돋보기 아이콘 + 입력창(searchInput)
export const searchBox =
  "flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-400 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100";
export const searchInput =
  "min-w-0 flex-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400";

// ───────── 표 ─────────
// 표를 감싸는 카드 (둥근 모서리 밖으로 표가 삐져나오지 않게 overflow-hidden)
export const tableCard = `overflow-hidden ${card}`;
export const thead = "border-b border-slate-200 bg-slate-50";
// 칸 정렬(text-left/center)과 너비(w-20 등)는 화면에서 붙임
export const th = "px-4 py-3 text-xs font-semibold text-slate-500";
export const td = "px-4 py-3";

// ───────── 배지(작은 둥근 꼬리표) ─────────
// 색은 화면에서 붙임: `${badge} bg-amber-50 text-amber-700`
export const badge = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

// ───────── 탭 ─────────
// 화면 안 큰 구분(진행중/승인됨/반려됨, 예약하기/내 예약): 밑줄 탭
export const tabStyle = (active: boolean) =>
  active
    ? "-mb-px border-b-2 border-indigo-600 px-4 py-2.5 text-sm font-semibold text-indigo-600"
    : "-mb-px border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800";

// 카드 안 작은 전환(내 예약/전체 예약): 회색 틀 안에서 고른 것만 흰색
export const segmentStyle = (active: boolean) =>
  active
    ? "rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-xs"
    : "rounded-md px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800";

// ───────── 글이 없을 때·불러오는 중 ─────────
export const emptyText = "py-12 text-center text-sm text-slate-400";
