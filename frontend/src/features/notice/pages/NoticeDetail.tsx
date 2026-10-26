// 공지사항 상세 화면
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import useNotice from "../hooks/useNotice";
import { useAuth } from "../../user/context/AuthContext";
import { delete_notice } from "../apis/noticeApi";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useNotice(id);
  const [searchParams] = useSearchParams();
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  const { isLoggedIn, user } = useAuth();
  const handleRemove = async (id: string | undefined) => {
    if (!id) return;

    try {
      const result = await delete_notice(id);
      console.log(result);
      navigate(`/notices?page=${Page}&size=${Size}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-8 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        <span className="text-slate-600">공지글</span>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200  px-8 py-7">
          <h1 className="text-2xl font-bold">{data.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span className="font-medium text-slate-600">{data.author.name}</span>
            <span>{data.created_at.slice(0, 10)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-100 px-8 py-10 leading-8 text-slate-700">
          <p>{data.content}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-200 px-8 py-5">
          <Link
            to={`/notices?page=${Page}&size=${Size}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            목록
          </Link>

          {user?.role == "ADMIN" && isLoggedIn && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigate({
                    pathname: `/notices/${id}/edit`,
                    search: `?page=${Page}&size=${Size}`,
                  })
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 "
              >
                수정
              </button>

              <button
                onClick={() => {
                  if (confirm("정말로 삭제하시겠습니까?")) {
                    handleRemove(id);
                  }
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NoticeDetail;
