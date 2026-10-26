import { useNavigate, useSearchParams } from "react-router-dom";
import type { NoticeCreate } from "../types/notice";
import { post_notice } from "../apis/noticeApi";
import { useState } from "react";

const NoticeWrite = () => {
  const [form, setForm] = useState<NoticeCreate>({
    title: "",
    content: "",
    is_pinned: "N",
  });
  const { title, content, is_pinned } = form;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const size = Number(searchParams.get("size")) || 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSubmit = async (data: NoticeCreate) => {
    try {
      const result = await post_notice(data);
      console.log(result);
      navigate(`/notices?page=${1}&size=${size}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <>
          <h1 className="text-3xl font-bold">게시글 생성</h1>
          <p className="mt-2 text-slate-500">게시글을 작성해주세요.</p>
        </>
      </div>

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

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeWrite;
