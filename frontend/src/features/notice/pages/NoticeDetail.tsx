// 공지사항 상세 화면
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import useNotice from "../hooks/useNotice";
import { useAuth } from "../../user/context/AuthContext";
import { delete_notice } from "../apis/noticeApi";
import PageHeader from "../../../common/components/PageHeader";
import { badge, btnDanger, btnSecondary, card } from "../../../common/style";

const NoticeDetail = () => {
  // 주소창의 id 가져오기
  const { id } = useParams();
  const navigate = useNavigate();
  // 해당 id 를 통해 상세 데이터 가져오기
  const data = useNotice(id);
  const [searchParams] = useSearchParams();
  // 주소단의 page,size 의 값 가져오기 / 기본값 1,10
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  // 로그인확인,유저(role 확인용)
  const { isLoggedIn, user } = useAuth();
  // 삭제 요청 후 끝나면 전에 있었던 전체 페이지로 이동
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
      <PageHeader title="공지사항" breadcrumb={["공지사항", "공지 보기"]} />

      <article className={card}>
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            {data.is_pinned === "Y" && <span className={`${badge} bg-amber-100 text-amber-700`}>필독</span>}
            <h2 className="text-xl font-bold">{data.title}</h2>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
            <span className="font-medium text-slate-600">{data.author.name}</span>
            <span>{data.created_at.slice(0, 10)}</span>
          </div>
        </div>

        {/* Content: 줄바꿈을 입력한 그대로 보여줌(whitespace-pre-wrap) */}
        <div className="min-h-48 px-6 py-6 leading-7 text-slate-700">
          <p className="whitespace-pre-wrap">{data.content}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-100 px-6 py-4">
          <Link to={`/notices?page=${Page}&size=${Size}`} className={btnSecondary}>
            목록
          </Link>

          {/* 관리자만 수정/삭제 버튼이 보임 */}
          {isLoggedIn && user?.role == "ADMIN" && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigate({
                    pathname: `/notices/${id}/edit`,
                    search: `?page=${Page}&size=${Size}`,
                  })
                }
                className={btnSecondary}
              >
                수정
              </button>

              <button
                onClick={() => {
                  if (confirm("정말로 삭제하시겠습니까?")) {
                    handleRemove(id);
                  }
                }}
                className={btnDanger}
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
