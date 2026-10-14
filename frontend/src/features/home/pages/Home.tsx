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
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-10 py-16 text-white">
        {/* Decorative Circle */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20" />
        <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-indigo-400/10" />

        <div className="relative max-w-2xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-indigo-300">
            ✦ Dev BOARD
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            함께 이야기하고
            <br />
            <span className="text-indigo-400">함께 성장하세요.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            개발에 대한 생각과 경험을 자유롭게 공유하는 커뮤니티입니다.
            <br />
            궁금한 것이 있다면 질문하고, 알고 있는 것이 있다면 함께 나눠보세요.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              to="/boards"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
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
              className={`shrink-0 rounded-lg bg-white/15 px-5 py-2.5 text-center text-sm font-semibold text-white ${isLoggedIn ? " hover:bg-white/10" : "cursor-not-allowed opacity-50"}`}
            >
              글 작성하기
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Menu */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/boards"
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-xl">
            💬
          </div>

          <h2 className="font-semibold">자유게시판</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            자유롭게 이야기를 나누고
            <br />
            다양한 의견을 공유해보세요.
          </p>

          <div className="mt-4 text-sm font-medium text-indigo-600">
            게시판 보기 →
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
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-xl">
            ✎
          </div>

          <h2 className="font-semibold">새 글 작성</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            나누고 싶은 이야기를
            <br />
            새로운 게시글로 작성해보세요.
          </p>

          <div className="mt-4 text-sm font-medium text-indigo-600">
            글 작성하기 →
          </div>
        </Link>

        <Link
          to="/about"
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-xl">
            ✦
          </div>

          <h2 className="font-semibold">DEV BOARD</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            프로젝트와 게시판에 대한
            <br />
            자세한 내용을 확인해보세요.
          </p>

          <div className="mt-4 text-sm font-medium text-indigo-600">
            자세히 보기 →
          </div>
        </Link>
      </section>

      {/* Recent Posts */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold">최근 게시글</h2>
            <p className="mt-1 text-sm text-slate-500">
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
              <Link
                key={post.id}
                to={`/boards/${post.id}`}
                className="flex items-center gap-5 px-6 py-5 transition hover:bg-slate-50"
              >
                <span className="hidden w-8 text-center text-sm text-slate-300 sm:block">
                  {post.id}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-slate-800">
                    {post.title}
                  </h3>

                  <div className="mt-2 flex gap-3 text-xs text-slate-400">
                    <span>{post.user.name}</span>
                    <span>{post.created_at}</span>
                    <span>조회 {post.views} </span>
                  </div>
                </div>

                <span className="text-slate-300">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="mt-12 rounded-xl border border-indigo-100 bg-indigo-50 px-8 py-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
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
        </div>
      </section>
    </div>
  );
};

export default Home;
