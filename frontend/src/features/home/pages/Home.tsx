import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BoardResponse } from "../../board/types/board";
import { getRecents } from "../../board/apis/boardApi";
import { useAuth } from "../../user/context/AuthContext";

const Home = () => {
  const [data, setData] = useState<BoardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serverData = await getRecents();
        setData(serverData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const recentPosts = data;

  if (loading) {
    return <p>Loading....</p>;
  }
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-6 text-white">
        {/* Decorative Circle */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20" />
        <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-indigo-400/10" />

        {/* 글은 왼쪽, 버튼은 오른쪽에 두어 높이를 줄임 */}
        <div className="relative flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-300">
              ✦ Dev BOARD
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              함께 이야기하고
              <br />
              <span className="text-indigo-400">함께 성장하세요.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              개발에 대한 생각과 경험을 자유롭게 공유하는 커뮤니티입니다.
              <br />
              궁금한 것이 있다면 질문하고, 알고 있는 것이 있다면 함께
              나눠보세요.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              to="/boards"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              게시판 둘러보기 →
            </Link>

            <Link
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("로그인이 필요한 서비스입니다.");
                }
              }}
              to="/boards/write"
              className={`shrink-0 rounded-lg bg-white/15 px-4 py-2 text-center text-sm font-semibold text-white ${isLoggedIn ? " hover:bg-white/10" : "cursor-not-allowed opacity-50"}`}
            >
              글 작성하기
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Menu: 아이콘을 글 왼쪽에 두어 카드 높이를 줄임 */}
      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <Link
          to="/boards"
          className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
            💬
          </div>

          <div>
            <h2 className="font-semibold">자유게시판</h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              자유롭게 이야기를 나누고
              <br />
              다양한 의견을 공유해보세요.
            </p>

            <div className="mt-2 text-sm font-medium text-indigo-600">
              게시판 보기 →
            </div>
          </div>
        </Link>

        <Link
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              alert("로그인이 필요한 서비스입니다.");
            }
          }}
          to="/boards/write"
          className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
            ✎
          </div>

          <div>
            <h2 className="font-semibold">새 글 작성</h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              나누고 싶은 이야기를
              <br />
              새로운 게시글로 작성해보세요.
            </p>

            <div className="mt-2 text-sm font-medium text-indigo-600">
              글 작성하기 →
            </div>
          </div>
        </Link>

        <Link
          to="/about"
          className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
            ✦
          </div>

          <div>
            <h2 className="font-semibold">DEV BOARD</h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              프로젝트와 게시판에 대한
              <br />
              자세한 내용을 확인해보세요.
            </p>

            <div className="mt-2 text-sm font-medium text-indigo-600">
              자세히 보기 →
            </div>
          </div>
        </Link>
      </section>

      {/* 아래쪽: 최근 게시글(왼쪽 2칸) + 배너(오른쪽 1칸) 나란히 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Recent Posts */}
        <section className="lg:col-span-2">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold">최근 게시글</h2>
              <p className="text-sm text-slate-500">
                최근에 작성된 게시글을 확인해보세요.
              </p>
            </div>

            <Link
              to="/boards"
              className="text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              전체보기 →
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {recentPosts.map((post) => (
                // 제목과 작성자·날짜·조회를 한 줄에 두어 줄 높이를 줄임
                <Link
                  key={post.id}
                  to={`/boards/${post.id}`}
                  className="flex items-center gap-4 px-5 py-2.5 transition hover:bg-slate-50"
                >
                  <span className="hidden w-8 text-center text-sm text-slate-300 sm:block">
                    {post.id}
                  </span>

                  <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                    {post.title}
                  </h3>

                  <div className="flex shrink-0 gap-3 text-xs text-slate-400">
                    <span>{post.author?.name}</span>
                    <span>{post.created_at}</span>
                    <span>조회 {post.view_count} </span>
                  </div>

                  <span className="text-slate-300">›</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="flex flex-col justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              여러분의 이야기를 들려주세요.
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              작은 질문 하나가 새로운 대화의 시작이 될 수 있습니다.
            </p>
          </div>

          <Link
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                alert("로그인이 필요한 서비스입니다.");
              }
            }}
            to="/boards/write"
            className={`shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white ${isLoggedIn ? " hover:bg-indigo-700" : "cursor-not-allowed opacity-50"}`}
          >
            게시글 작성
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
