import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useNotices from "../../notice/hooks/useNotices";
import type { ApprovalPageResponse } from "../../approval/types/approval";
import { getApprovalList } from "../../approval/apis/approvalApi";
import { initialApprovals } from "../../approval/hooks/useApprovals";
import { useAuth } from "../../user/context/AuthContext";

// 오늘 날짜를 "2026년 10월 23일 금요일" 모양으로 만들기
const today = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const Home = () => {
  // 공지사항은 로그인 없이도 볼 수 있음
  // 백엔드가 고정글(필독)은 페이지와 상관없이 전부 앞에 붙여 주므로 1페이지만 받으면 됨
  const notices = useNotices(1, 5);
  // 필독(is_pinned === "Y")만 남기기
  const pinnedNotices = notices.items.filter((notice) => notice.is_pinned === "Y");

  // 결재 목록 응답은 { items, total, page, size, total_pages } 모양
  const [pending, setPending] = useState<ApprovalPageResponse>(initialApprovals);
  const [drafted, setDrafted] = useState<ApprovalPageResponse>(initialApprovals);
  const { isLoggedIn, user } = useAuth();

  // 결재 목록은 로그인했을 때만 요청
  // (로그인 안 한 상태로 요청하면 401 → 로그인 페이지로 이동되기 때문)
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const fetchData = async () => {
      try {
        // 결재 대기: 위젯에 5개만 보여주므로 5개만 받음
        setPending(await getApprovalList("pending", 1, 5, "title", ""));
        // 내 기안: 개수(total)만 쓰므로 1개만 받음
        setDrafted(await getApprovalList("drafted", 1, 1, "title", ""));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  return (
    // 왼쪽 aside(고정 폭) + 오른쪽 위젯 영역을 한 줄에 나란히
    <div className="flex items-start gap-4">
      {/* 왼쪽: 내 정보 · 결재 현황 · 바로가기 (작게) */}
      <aside className="flex w-60 shrink-0 flex-col gap-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">{today}</p>

          {isLoggedIn ? (
            <>
              <div className="mt-3 flex items-center gap-3">
                {/* 이름 첫 글자로 만든 동그란 프로필 */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {user?.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{user?.name}님, 안녕하세요</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              {/* 결재 현황 숫자 */}
              <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 text-sm">
                <Link to="/approvals/inbox" className="flex justify-between py-2 hover:text-indigo-600">
                  <span className="text-slate-600">결재 대기</span>
                  <span className="font-bold text-indigo-600">{pending.total}</span>
                </Link>
                <Link to="/approvals" className="flex justify-between py-2 hover:text-indigo-600">
                  <span className="text-slate-600">내 기안 진행중</span>
                  {/* 내 기안 목록은 원래 처리 안 된(IN_PROGRESS) 문서만 오므로 total이 곧 진행중 개수 */}
                  <span className="font-bold text-slate-700">{drafted.total}</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-3 text-center">
              <p className="text-sm text-slate-500">로그인하면 내 결재 현황을 볼 수 있습니다.</p>
              <Link
                to="/users/signin"
                className="mt-3 block rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                로그인
              </Link>
            </div>
          )}
        </section>

        {/* 바로가기 */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-1 text-xs font-semibold text-slate-400">바로가기</h2>
          <div className="flex flex-col text-sm">
            <Link to="/approvals/write" className="rounded px-2 py-1.5 hover:bg-slate-50 hover:text-indigo-600">
              📝 기안 작성
            </Link>
            <Link to="/approvals/inbox" className="rounded px-2 py-1.5 hover:bg-slate-50 hover:text-indigo-600">
              ✅ 결재 대기함
            </Link>
            <Link to="/rooms" className="rounded px-2 py-1.5 hover:bg-slate-50 hover:text-indigo-600">
              🏢 회의실 예약
            </Link>
            <Link to="/notices" className="rounded px-2 py-1.5 hover:bg-slate-50 hover:text-indigo-600">
              📢 공지사항
            </Link>
          </div>
        </section>
      </aside>

      {/* 오른쪽: 결재 대기 · 공지사항 위젯을 나란히 */}
      <div className="grid min-w-0 flex-1 gap-4 lg:grid-cols-2">
        {/* 결재 대기 위젯: 내가 승인·반려해야 하는 문서 */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              결재 대기
              {isLoggedIn && (
                <span className="rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{pending.total}</span>
              )}
            </h2>
            <Link to="/approvals/inbox" className="text-xs text-slate-400 hover:text-indigo-600">
              더보기 +
            </Link>
          </div>

          {!isLoggedIn ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">로그인 후 확인할 수 있습니다.</p>
          ) : pending.items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">결재할 문서가 없습니다. 👍</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* 서버에서 5개만 받아 왔으므로 그대로 보여주기 */}
              {pending.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/approvals/${item.id}`}
                  className="block px-4 py-2 transition hover:bg-slate-50"
                >
                  <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-400">
                    {item.drafter.name} {item.drafter.position} · {item.created_at.slice(0, 10)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 필독 공지 위젯 */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <h2 className="text-sm font-semibold">필독 공지</h2>
            <Link to="/notices" className="text-xs text-slate-400 hover:text-indigo-600">
              더보기 +
            </Link>
          </div>

          {pinnedNotices.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">필독 공지가 없습니다.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* 한 화면에 들어오게 5개만 보여주기 */}
              {pinnedNotices.slice(0, 5).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="block px-4 py-2 transition hover:bg-slate-50"
                >
                  <p className="truncate text-sm text-slate-800">{notice.title}</p>
                  <p className="text-xs text-slate-400">
                    {notice.author.name} · {notice.created_at.slice(0, 10)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
