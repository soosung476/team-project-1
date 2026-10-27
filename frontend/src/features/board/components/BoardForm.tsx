import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BoardCreate } from "../types/board";
import PageHeader from "../../../common/components/PageHeader";
import { btnPrimary, btnSecondary, card, input, label } from "../../../common/style";

const BoardForm = ({ onSubmit, board }: { onSubmit: (board: BoardCreate) => void; board?: BoardCreate }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: board?.title ?? "",
    content: board?.content ?? "",
  });
  const { title, content } = form;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div>
      {!board ? (
        <PageHeader title="게시글 작성" description="새로운 게시글을 작성해주세요." breadcrumb={["게시판", "글쓰기"]} />
      ) : (
        <PageHeader title="게시글 수정" description="게시글을 수정해주세요." breadcrumb={["게시판", "수정"]} />
      )}

      <form
        className={card}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <div className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label className={label}>제목</label>

            <input
              name="title"
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => handleChange(e)}
              className={`${input} w-full`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={label}>내용</label>

            <textarea
              name="content"
              rows={12}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => handleChange(e)}
              className={`${input} w-full resize-none leading-6`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" className={btnSecondary} onClick={() => navigate(-1)}>
            취소
          </button>
          {!board ? (
            <button type="submit" className={btnPrimary}>
              작성
            </button>
          ) : (
            <button type="submit" className={btnPrimary}>
              수정
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BoardForm;
