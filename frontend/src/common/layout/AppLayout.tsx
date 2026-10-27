import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LuCalendarDays,
  LuDoorOpen,
  LuFileCheck,
  LuHouse,
  LuMegaphone,
  LuMessagesSquare,
  LuNetwork,
  LuUsers,
} from "react-icons/lu";
import { useAuth } from "../../features/user/context/AuthContext";
import { btnPrimarySm, btnSecondarySm } from "../style";

// 오늘 날짜를 "2026년 10월 27일 화요일" 모양으로 만들기
const today = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

// 사이드바 메뉴 한 줄 모양: 지금 보고 있는 메뉴(isActive)면 연한 남색 배경 + 진한 글자
const menuStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

const AppLayout = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout, user } = useAuth();
  return (
    // 화면을 왼쪽 사이드바(고정 폭) + 오른쪽(상단바 → 내용)으로 나눔
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* ───────── 왼쪽 사이드바: 로고 + 메뉴 ───────── */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <NavLink to="/" className="flex h-16 shrink-0 items-center gap-2.5 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold tracking-tight">팀웍스</span>
        </NavLink>

        {/* 메뉴가 많아지면 이 부분만 스크롤 */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-3 pb-2 text-xs font-semibold text-slate-400">업무</p>
          <div className="flex flex-col gap-1">
            {/* react-icons의 아이콘(Lu…)은 글자처럼 text-lg로 크기를 정함 */}
            <NavLink to="/" className={menuStyle}>
              <LuHouse className="text-lg" />
              홈
            </NavLink>
            <NavLink to="/notices" className={menuStyle}>
              <LuMegaphone className="text-lg" />
              공지사항
            </NavLink>
            <NavLink to="/approvals" className={menuStyle}>
              <LuFileCheck className="text-lg" />
              전자결재
            </NavLink>
            <NavLink to="/rooms" className={menuStyle}>
              <LuCalendarDays className="text-lg" />
              회의실 예약
            </NavLink>
            <NavLink to="/boards" className={menuStyle}>
              <LuMessagesSquare className="text-lg" />
              자유게시판
            </NavLink>
          </div>

          {/* 관리자 메뉴: ADMIN만 보임 */}
          {isLoggedIn && user?.role === "ADMIN" && (
            <>
              <p className="mt-6 px-3 pb-2 text-xs font-semibold text-slate-400">관리자</p>
              <div className="flex flex-col gap-1">
                <NavLink to="/admin/users" className={menuStyle}>
                  <LuUsers className="text-lg" />
                  사용자 관리
                </NavLink>
                <NavLink to="/department" className={menuStyle}>
                  <LuNetwork className="text-lg" />
                  부서 관리
                </NavLink>
                <NavLink to="/admin/rooms" className={menuStyle}>
                  <LuDoorOpen className="text-lg" />
                  회의실 관리
                </NavLink>
              </div>
            </>
          )}
        </nav>

        <p className="shrink-0 border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          © 2026 팀웍스
        </p>
      </aside>

      {/* ───────── 오른쪽: 상단바 + 내용 ───────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 상단바: 왼쪽 오늘 날짜 / 오른쪽 내 정보 + 로그인·로그아웃 */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <p className="text-sm text-slate-500">{today}</p>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                {/* 이름 첫 글자로 만든 동그란 프로필 */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {user?.name.slice(0, 1)}
                </div>
                <div className="leading-tight">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {user?.name}
                    {user?.role === "ADMIN" && (
                      <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">
                        관리자
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button className={btnSecondarySm} onClick={() => logout()}>
                로그아웃
              </button>
            </div>
          ) : (
            <button
              className={btnPrimarySm}
              onClick={() => navigate("/users/signin")}
            >
              로그인
            </button>
          )}
        </header>

        {/* 내용: 남는 높이를 모두 차지(flex-1)하고, 넘치면 이 영역만 스크롤 */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-6">
            {/* URL 에 따라 달라질 부분 */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
