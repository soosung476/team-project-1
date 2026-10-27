import { useState } from "react";
import { useAuth } from "../../user/context/AuthContext";
import type { CommentResponse } from "../types/board";
import {
  btnPrimary,
  btnPrimarySm,
  btnSecondarySm,
  card,
  cardHeader,
  cardTitle,
  input,
} from "../../../common/style";
export type ReplyProps = {
  comment: CommentResponse[];
  handleCommentRemove: (commentId: number) => void;
  handleCommentSubmit: (commentContent: string) => void;
  handleCommentEdit: (commentId: number, editContent: string) => void;
};

const ReplyComp = ({ comment, handleCommentRemove, handleCommentSubmit, handleCommentEdit }: ReplyProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canManage = (authorId: number) => user?.id === authorId || isAdmin;

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
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  return (
    <section className={`mt-4 overflow-hidden ${card}`}>
      {/* 댓글 헤더 */}
      <div className={cardHeader}>
        <h2 className={cardTitle}>
          댓글
          <span className="ml-1 text-indigo-600">{comment.length ?? 0}</span>
        </h2>
      </div>

      {/* 댓글 목록 */}
      <div>
        {comment.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-400">등록된 댓글이 없습니다.</div>
        ) : (
          comment.map((comment: CommentResponse) => (
            <div className="border-b border-slate-100 px-6 py-4 last:border-b-0" key={comment.id}>
              {/* 댓글 상단 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {comment.author.name.charAt(0)}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-800">{comment.author.name}</div>

                    {/* "2026-10-27T10:20:30" → "2026-10-27 10:20" */}
                    <div className="mt-0.5 text-xs text-slate-400">
                      {comment.created_at.slice(0, 16).replace("T", " ")}
                    </div>
                  </div>
                </div>

                {/* 댓글 수정/삭제 버튼 */}
                {editingCommentId !== comment.id && canManage(comment.author_id) && (
                  <div className="flex items-center gap-3 text-xs">
                    <button onClick={() => handleEditStart(comment)} className="text-slate-400 hover:text-indigo-600">
                      수정
                    </button>

                    <span className="text-slate-200">|</span>

                    <button
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => handleCommentRemove(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글내용 */}
              {editingCommentId == comment.id ? (
                <div className="mt-3 pl-11">
                  <textarea
                    onChange={(e) => setEditContent(e.target.value)}
                    value={editContent}
                    className={`${input} min-h-25 w-full resize-none`}
                  />

                  <div className="mt-2 flex justify-end gap-2">
                    <button onClick={() => handleEditCancel()} className={btnSecondarySm}>
                      취소
                    </button>

                    <button onClick={() => handleEditSaveWrapper(comment.id)} className={btnPrimarySm}>
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                // 왼쪽 동그란 프로필(32px) + 간격만큼 들여 씀
                <p className="mt-2 pl-11 whitespace-pre-wrap text-sm leading-6 text-slate-700">{comment.content}</p>
              )}
            </div>
          ))
        )}

        {/* 댓글개수 존재할 때 */}
      </div>
      {/* 댓글 작성 */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex gap-3">
          <textarea
            value={commentContent}
            placeholder="댓글을 입력해주세요."
            className={`${input} min-h-16 flex-1 resize-none`}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button className={`${btnPrimary} self-end`} onClick={() => handleCommentSubmitWrapper()}>
            댓글 등록
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReplyComp;
