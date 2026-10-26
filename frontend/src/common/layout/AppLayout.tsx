import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/user/context/AuthContext";

const AppLayout = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout, user } = useAuth();
  return (
    // 화면 높이(h-screen)를 위에서부터 헤더 → 메뉴 → 컨텐츠 → 푸터 순서로 세로(flex-col)로 나눔
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header 1줄: 로고 + 로그인 */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
          <NavLink to="/" className="text-lg font-bold tracking-tight">
            💻 SimpleWare
          </NavLink>
          {/* 오른쪽 묶음: 관리자페이지 + 로그인/로그아웃 (div로 묶어야 둘이 붙어서 오른쪽에 섬) */}
          <div className="flex items-center gap-3">
            {user?.role == "ADMIN" && isLoggedIn && (
              <>
              <button
                className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                onClick={() => navigate("/admin/users")}
                >
                관리자페이지
              </button>
              {/* <button 
               className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
               onClick={() => navigate("/department")}>
                부서관리
              </button> */}
              </>
            )}

            {!isLoggedIn ? (
              <button
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate("/users/signin")}
              >
                로그인
              </button>
            ) : (
              <button
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                onClick={() => logout()}
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Header 2줄: 메뉴 */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-10 max-w-6xl items-center gap-8 px-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            홈
          </NavLink>

          <NavLink
            to="/notices"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            공지사항
          </NavLink>
          <NavLink
            to="/approvals"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            결재관리
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            회의실
          </NavLink>
          <NavLink
            to="/boards"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }
          >
            게시판
          </NavLink>
        </div>
      </nav>

      {/* Content: 남는 높이를 모두 차지(flex-1)하고, 넘치면 이 영역만 스크롤 */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-6">
          {/* URL 에 따라 달라질 부분 */}
          <Outlet />
        </div>
      </main>

      {/* Footer: 항상 화면 맨 아래에 작게 */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="py-2 text-center text-xs text-slate-400">
          © 2026 BOARD. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
