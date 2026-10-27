import { Link, Outlet } from "react-router-dom";

// 로그인·회원가입 전용 레이아웃 (사이드바 없음)
// 넓은 화면: 왼쪽 소개 영역 + 오른쪽 입력 폼 / 좁은 화면: 폼만
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* 왼쪽 소개 (lg 이상에서만 보임) */}
      <div className="hidden w-[44%] flex-col justify-between bg-indigo-600 p-12 text-white lg:flex">
        {/* 로고를 누르면 로그인 없이 홈(공지 보기)으로 돌아감 */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-bold text-indigo-600">
            T
          </span>
          <span className="text-xl font-bold tracking-tight">팀웍스</span>
        </Link>

        <div>
          <h2 className="text-3xl leading-snug font-bold">
            결재·공지·회의실 예약을
            <br />한 화면에서
          </h2>
          <p className="mt-4 text-indigo-100">
            팀웍스는 사내 업무를 한곳에서 처리하는 그룹웨어입니다.
          </p>
        </div>

        <p className="text-sm text-indigo-200">© 2026 팀웍스</p>
      </div>

      {/* 오른쪽 폼 (LoginPage·SignupPage가 들어옴) */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
