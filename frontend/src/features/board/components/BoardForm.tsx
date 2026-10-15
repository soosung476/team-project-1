import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BoardCreate } from "../types/board";

const BoardForm = ({
  onSubmit,
  board,
}: {
  onSubmit: (board: BoardCreate) => void;
  board?: BoardCreate;
}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: board?.title ?? "",
    contents: board?.contents ?? "",
    user_id: board?.user_id ?? 1,
  });
  const { title, contents } = form;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div>
      <div className="mb-4">
        {!board ? (
          <>
            <h1 className="text-2xl font-bold">게시글 작성</h1>
            <p className="mt-1 text-sm text-slate-500">
              새로운 게시글을 작성해주세요.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">게시글 수정</h1>
            <p className="mt-1 text-sm text-slate-500">
              게시글을 수정해주세요.
            </p>
          </>
        )}
      </div>

      <form
        className="rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold">제목</label>

          <input
            name="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => handleChange(e)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Content */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold">내용</label>

          <textarea
            name="contents"
            rows={10}
            placeholder="내용을 입력하세요"
            value={contents}
            onChange={(e) => handleChange(e)}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          {!board ? (
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              작성
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              수정
            </button>
          )}
          <></>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;
