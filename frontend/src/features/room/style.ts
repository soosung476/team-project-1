// 카드 박스 공통 스타일 (팀 디자인 확정 시 여기만 바꾸면 됨)
export const card = "overflow-hidden rounded-xl border border-slate-200 bg-white";
export const cardHeader =
  "flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3";
 
// 탭 버튼 스타일 회의실 칩이랑 똑같이
export const tabStyle = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
    active
      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
  }`;
 