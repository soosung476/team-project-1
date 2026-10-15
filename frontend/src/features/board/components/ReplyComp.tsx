import { useState } from "react";
import type { CommentResponse } from "../types/board";
export type ReplyProps = {
  comments: CommentResponse[];
  handleCommentRemove: (commentId: number) => void;
  handleCommentSubmit: (commentContent: string) => void;
  handleCommentEdit: (commentId: number, editContent: string) => void;
};

const ReplyComp = ({
  comments,
  handleCommentRemove,
  handleCommentSubmit,
  handleCommentEdit,
}: ReplyProps) => {
  const [commentContent, setCommentContent] = useState("");
  const handleCommentSubmitWrapper = () => {
    handleCommentSubmit(commentContent);
    setCommentContent("");
  };

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const handleEditSaveWrapper = (commnetId: number) => {
    handleCommentEdit(commnetId, editContent);
    setEditingCommentId(null);
    setEditContent("");
  };
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };
  // 댓글 수정 버튼 클릭 시 수정하고자 하는 댓글 정보 관리
  const handleEditStart = (comment: CommentResponse) => {
    setEditingCommentId(comment.comment_id);
    setEditContent(comment.body);
  };

  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white">
      {/* 댓글 헤더 */}
      <div className="border-b border-slate-200 px-6 py-3">
        <h2 className="text-base font-bold">
          댓글
          <span className="ml-1 text-indigo-600">{comments.length ?? 0}</span>
        </h2>
      </div>

      {/* 댓글 목록 */}
      <div>
        {comments.length === 0 ? (
          <div className="px-6 py-6 text-center text-sm text-slate-400">
            등록된 댓글이 없습니다.
          </div>
        ) : (
          comments.map((comment: CommentResponse) => (
            <div
              className="border-b border-slate-100 px-6 py-4 last:border-b-0"
              key={comment.comment_id}
            >
              {/* 댓글 상단 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                    {comment.user.name.charAt(0)}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {comment.user.name}
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      {comment.created_at}
                    </div>
                  </div>
                </div>

                {/* 댓글 수정/삭제 버튼 */}
                {editingCommentId !== comment.comment_id && (
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      수정
                    </button>

                    <span className="text-slate-200">|</span>

                    <button
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => handleCommentRemove(comment.comment_id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글내용 */}
              {editingCommentId == comment.comment_id ? (
                <div className="mt-3">
                  <textarea
                    onChange={(e) => setEditContent(e.target.value)}
                    value={editContent}
                    className="min-h-25 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleEditCancel()}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      취소
                    </button>

                    <button
                      onClick={() => handleEditSaveWrapper(comment.comment_id)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {comment.body}
                </p>
              )}
            </div>
          ))
        )}

        {/* 댓글개수 존재할 때 */}
      </div>
      {/* 댓글 작성 */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">댓글 작성</h3>
        <div className="flex gap-3">
          <textarea
            value={commentContent}
            placeholder="댓글을 입력해주세요."
            className="min-h-16 flex-1 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleCommentSubmitWrapper()}
          >
            댓글 등록
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReplyComp;
