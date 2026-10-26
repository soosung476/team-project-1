// "2026-11-20T09:30:00" → "09:30"
export const toHHMM = (iso: string) => iso.slice(11, 16);

// 숫자를 두 자리로: 9 → 09
export const pad = (n: number) => String(n).padStart(2, "0");

// 오늘 날짜 "YYYY-MM-DD"
export const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};