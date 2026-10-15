import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/user/context/AuthContext";

const AppLayout = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
          <NavLink
            to="/"
            className="justify-self-start text-xl font-bold tracking-tight"
          >
            💻 SimpleWare
          </NavLink>

          <nav className="flex items-center gap-8 text-sm">
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
              결제관리
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
          </nav>

          <div className="justify-self-end">
            {!isLoggedIn ? (
              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate("/users/signin")}
              >
                로그인
              </button>
            ) : (
              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                onClick={() => logout()}
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* URL 에 따라 달라질 부분 */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-400">
          © 2026 BOARD. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
