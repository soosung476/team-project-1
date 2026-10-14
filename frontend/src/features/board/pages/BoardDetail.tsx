import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { deleteBoard } from "../apis/boardApi";
import { deleteComment, postComment, putComment } from "../apis/commentApi";
import ReplyComp from "../components/ReplyComp";
import useBoard from "../hooks/useBoard";
import type { CommentCreate } from "../types/board";
import { useAuth } from "../../user/context/AuthContext";

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
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const result = await deleteComment(commentId);
      console.log(result);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (commentContent: string) => {
    if (!id) return;
    try {
      const comment: CommentCreate = {
        user_id: 1,
        board_id: Number(id),
        body: commentContent,
      };
      const result = await postComment(comment);
      console.log(result);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentEdit = async (commentId: number, editContent: string) => {
    if (!commentId) return;
    try {
      const result = await putComment(commentId, { body: editContent });
      console.log(result);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  if (!board) return;
  if (loading) {
    return <p>Loading....</p>;
  }
  return (
    <div>
      <div className="mb-8 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        게시판 <span className="mx-2">/</span>
        <span className="text-slate-600">게시글</span>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-7">
          <h1 className="text-2xl font-bold">{board.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <span className="font-medium text-slate-600">
              {board.user.name}
            </span>
            <span>{board.created_at}</span>
            <span>{board.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-100 px-8 py-10 leading-8 text-slate-700">
          <p className="whitespace-pre-wrap wrap-break-words">
            {board.contents}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-slate-200 px-8 py-5">
          <Link
            to={`/boards/?page=${currentPage}&size=${size}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            목록
          </Link>

          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
              disabled={user?.user_id !== board.user_id}
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
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
              disabled={user?.user_id !== board.user_id}
              onClick={() => {
                if (confirm("정말로 삭제하시겠습니까?")) {
                  deleteClick(id);
                }
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </article>
      {/* 댓글 보여주기 posts/${id}/cmments */}
      <ReplyComp
        comments={board.comments}
        handleCommentRemove={handleCommentRemove}
        handleCommentSubmit={handleCommentSubmit}
        handleCommentEdit={handleCommentEdit}
      />
    </div>
  );
};

export default BoardDetail;
