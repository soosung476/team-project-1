import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteBoard } from "../apis/boardApi";
import { deleteComment, postComment, putComment } from "../apis/commentApi";
import ReplyComp from "../components/ReplyComp";
import useBoard from "../hooks/useBoard";
import type { CommentCreate } from "../types/board";
import { useAuth } from "../../user/context/AuthContext";
import axios from "axios";
import PageHeader from "../../../common/components/PageHeader";
import { btnDanger, btnSecondary, card, emptyText } from "../../../common/style";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, board, refresh } = useBoard(id);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page"));
  const size = Number(searchParams.get("size"));
  const { user } = useAuth();

  console.log(board);

  const deleteClick = async (id: string | undefined) => {
    if (!id) {
      return;
    }
    try {
      const deletedata = await deleteBoard(id);
      console.log("삭제되었습니다", deletedata);
      navigate({
        pathname: `/boards`,
        search: `?page=${currentPage}&size=${size}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentRemove = async (commentId: number) => {
    if (!id) return;
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const result = await deleteComment(Number(id), commentId);
      console.log(result);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (commentContent: string) => {
    if (!id || !user) return;
    try {
      const comment: CommentCreate = {
        content: commentContent,
      };
      const result = await postComment(Number(id), comment);
      console.log(result);
      refresh();
    } catch (error) {
      // 공백·1000자 초과는 ReplyComp의 버튼 disabled로 먼저 막음
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail);
      } else {
        alert("댓글 작성에 실패했습니다.");
      }
    }
  };

  const handleCommentEdit = async (commentId: number, editContent: string) => {
    if (!id || !commentId) return;
    try {
      const result = await putComment(Number(id), commentId, { content: editContent });
      console.log(result);
      refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail);
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    }
  };

  if (!board) return;
  if (loading) {
    return <p className={emptyText}>불러오는 중입니다.</p>;
  }

  const isAdmin = user?.role === "ADMIN";
  const canManage = user?.id === board.author_id || isAdmin;

  return (
    <div>
      <PageHeader title="자유게시판" breadcrumb={["게시판", "게시글"]} />

      <article className={card}>
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold">{board.title}</h2>

          {/* 작성 시각은 "2026-10-27T10:20:30" → "2026-10-27 10:20" 으로 잘라서 보여줌 */}
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
            <span className="font-medium text-slate-600">{board.author.name}</span>
            <span>{board.created_at.slice(0, 16).replace("T", " ")}</span>
            <span>조회 {board.view_count}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-48 px-6 py-6 leading-7 text-slate-700">
          <p className="whitespace-pre-wrap wrap-break-word">{board.content}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-100 px-6 py-4">
          <Link to={`/boards/?page=${currentPage}&size=${size}`} className={btnSecondary}>
            목록
          </Link>

          {canManage && (
            <div className="flex gap-2">
              <button
                className={btnSecondary}
                onClick={() =>
                  navigate({
                    pathname: `/boards/${id}/edit`,
                    search: `?page=${currentPage}&size=${size}`,
                  })
                }
              >
                수정
              </button>

              <button
                className={btnDanger}
                onClick={() => {
                  if (confirm("정말로 삭제하시겠습니까?")) {
                    deleteClick(id);
                  }
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </article>
      {/* 댓글 보여주기 posts/${id}/cmments */}
      <ReplyComp
        comment={board.comments}
        handleCommentRemove={handleCommentRemove}
        handleCommentSubmit={handleCommentSubmit}
        handleCommentEdit={handleCommentEdit}
      />
    </div>
  );
};

export default BoardDetail;
