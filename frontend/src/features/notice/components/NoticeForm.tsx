import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NoticeCreate, NoticeUpdate } from "../types/notice";

const NoticeForm = ({ onSubmit, notice }: { onSubmit: (notice: NoticeUpdate) => void; notice?: NoticeCreate }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<NoticeCreate>(
    notice ?? {
      title: "",
      content: "",
      is_pinned: "N",
    },
  );
  const { title, content, is_pinned } = form;

  useEffect(() => {
    if (notice)
      setForm({
        title: notice.title,
        content: notice.content,
        is_pinned: notice.is_pinned,
      });
  }, [notice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };
  return (
    <div>
      {!notice ? (
        <div className="mb-8">
          <>
            <h1 className="text-3xl font-bold">게시글 작성</h1>
            <p className="mt-2 text-slate-500">게시글을 작성해주세요.</p>
          </>
        </div>
      ) : (
        <div className="mb-8">
          <>
            <h1 className="text-3xl font-bold">게시글 수정</h1>
            <p className="mt-2 text-slate-500">게시글을 수정해주세요.</p>
          </>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="rounded-xl border border-slate-200 bg-white p-8"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold">고정 설정</label>
          <input
            onChange={handleChange}
            value="Y"
            checked={is_pinned === "Y"}
            name="is_pinned"
            type="radio"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          />
          Y
          <input
            onChange={handleChange}
            value="N"
            checked={is_pinned === "N"}
            name="is_pinned"
            type="radio"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          />
          N
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">제목</label>

          <input
            onChange={handleChange}
            value={title}
            name="title"
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Content */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold">내용</label>

          <textarea
            onChange={handleChange}
            value={content}
            name="content"
            rows={5}
            placeholder="내용을 입력하세요"
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-2">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            취소
          </button>

          {!notice ? (
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              작성
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              수정
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
