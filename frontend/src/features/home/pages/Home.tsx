import { useEffect, useState } from "react";
import { LuFilePen, LuInbox, LuMegaphone } from "react-icons/lu";
import { Link } from "react-router-dom";
import PageHeader from "../../../common/components/PageHeader";
import { btnPrimary, btnSecondary, card, cardHeader, cardTitle, emptyText } from "../../../common/style";
import { getApprovalList } from "../../approval/apis/approvalApi";
import { initialApprovals } from "../../approval/hooks/useApprovals";
import type { ApprovalPageResponse } from "../../approval/types/approval";
import { get_notices } from "../../notice/apis/noticeApi";
import { BaseNotices } from "../../notice/hooks/useNotices";
import type { NoticeListResponse } from "../../notice/types/notice";
import { useAuth } from "../../user/context/AuthContext";

const Home = () => {
  // 결재 목록 응답은 { items, total, page, size, total_pages } 모양
  const [pending, setPending] = useState<ApprovalPageResponse>(initialApprovals);
  const [drafted, setDrafted] = useState<ApprovalPageResponse>(initialApprovals);
  const [notices, setNotices] = useState<NoticeListResponse>(BaseNotices);
  const { isLoggedIn, user } = useAuth();
  // 필독(is_pinned === "Y")만 남기기
  const pinnedNotices = notices.items.filter((notice) => notice.is_pinned === "Y");

  // 결재 목록, 공지사항은 로그인했을 때만 요청
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
        // 백엔드가 고정글(필독)은 페이지와 상관없이 전부 앞에 붙여 주므로 1페이지만 받으면 됨
        setNotices(await get_notices(1, 5));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  return (
    <div>
      {/* 인사말 + 자주 쓰는 동작 */}
      {isLoggedIn ? (
        <PageHeader title={`${user?.name}님, 안녕하세요`} description="오늘 처리할 일을 한눈에 확인하세요.">
          <Link to="/rooms" className={btnSecondary}>
            회의실 예약
          </Link>
          <Link to="/approvals/write" className={btnPrimary}>
            기안하기
          </Link>
        </PageHeader>
      ) : (
        <PageHeader title="팀웍스에 오신 것을 환영합니다" description="로그인하면 내 결재 현황을 볼 수 있습니다.">
          <Link to="/users/signin" className={btnPrimary}>
            로그인
          </Link>
        </PageHeader>
      )}

      {/* 숫자 카드 3개: 누르면 해당 목록으로 이동 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Link to="/approvals/inbox" className={`${card} p-5 transition hover:border-indigo-300`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">결재 대기</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-lg text-indigo-600">
              <LuInbox />
            </span>
          </div>
          {/* 로그인 전에는 숫자를 모르므로 - 만 표시 */}
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {isLoggedIn ? pending.total : "-"}
            {isLoggedIn && <span className="ml-1 text-sm font-medium text-slate-400">건</span>}
          </p>
          <p className="mt-1 text-xs text-slate-400">내가 승인·반려할 문서</p>
        </Link>

        <Link to="/approvals" className={`${card} p-5 transition hover:border-indigo-300`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">내 기안 진행중</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-lg text-sky-600">
              <LuFilePen />
            </span>
          </div>
          {/* 내 기안 목록은 원래 처리 안 된(IN_PROGRESS) 문서만 오므로 total이 곧 진행중 개수 */}
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {isLoggedIn ? drafted.total : "-"}
            {isLoggedIn && <span className="ml-1 text-sm font-medium text-slate-400">건</span>}
          </p>
          <p className="mt-1 text-xs text-slate-400">결재자가 아직 처리하지 않은 문서</p>
        </Link>

        <Link to="/notices" className={`${card} p-5 transition hover:border-indigo-300`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">필독 공지</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-lg text-amber-600">
              <LuMegaphone />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {isLoggedIn ? pinnedNotices.length : "-"}
            {isLoggedIn && <span className="ml-1 text-sm font-medium text-slate-400">건</span>}
          </p>
          <p className="mt-1 text-xs text-slate-400">상단에 고정된 공지</p>
        </Link>
      </div>

      {/* 위젯 2개: 결재 대기 · 필독 공지 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 결재 대기 위젯: 내가 승인·반려해야 하는 문서 */}
        <section className={`overflow-hidden ${card}`}>
          <div className={cardHeader}>
            <h2 className={`flex items-center gap-2 ${cardTitle}`}>
              결재 대기
              {/* 처리할 문서가 있을 때만 빨간 숫자 (0이면 경고처럼 보이지 않게 숨김) */}
              {isLoggedIn && pending.total > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{pending.total}</span>
              )}
            </h2>
            <Link to="/approvals/inbox" className="text-xs text-slate-400 hover:text-indigo-600">
              더보기 ›
            </Link>
          </div>

          {!isLoggedIn ? (
            <p className={emptyText}>로그인 후 확인할 수 있습니다.</p>
          ) : pending.items.length === 0 ? (
            <p className={emptyText}>결재할 문서가 없습니다.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* 서버에서 5개만 받아 왔으므로 그대로 보여주기 */}
              {pending.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/approvals/${item.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.drafter.name} {item.drafter.position}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{item.created_at.slice(0, 10)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 필독 공지 위젯 */}
        <section className={`overflow-hidden ${card}`}>
          <div className={cardHeader}>
            <h2 className={cardTitle}>필독 공지</h2>
            <Link to="/notices" className="text-xs text-slate-400 hover:text-indigo-600">
              더보기 ›
            </Link>
          </div>

          {!isLoggedIn ? (
            <p className={emptyText}>로그인 후 확인할 수 있습니다.</p>
          ) : pinnedNotices.length === 0 ? (
            <p className={emptyText}>필독 공지가 없습니다.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* 한 화면에 들어오게 5개만 보여주기 */}
              {pinnedNotices.slice(0, 5).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{notice.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{notice.author.name}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{notice.created_at.slice(0, 10)}</span>
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
