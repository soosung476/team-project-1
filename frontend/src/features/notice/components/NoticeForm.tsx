import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NoticeCreate, NoticeUpdate } from "../types/notice";
import PageHeader from "../../../common/components/PageHeader";
import { btnPrimary, btnSecondary, card, input, label } from "../../../common/style";

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
        <PageHeader title="공지 작성" description="전 직원에게 알릴 공지를 작성해주세요." breadcrumb={["공지사항", "글쓰기"]} />
      ) : (
        <PageHeader title="공지 수정" description="공지 내용을 수정해주세요." breadcrumb={["공지사항", "수정"]} />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className={card}
      >
        <div className="space-y-5 p-6">
          {/* 고정 설정: Y면 목록 맨 위·홈 「필독 공지」에 보임 */}
          <div>
            <p className={label}>고정 설정</p>
            <div className="flex gap-6 text-sm text-slate-700">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  onChange={handleChange}
                  value="Y"
                  checked={is_pinned === "Y"}
                  name="is_pinned"
                  type="radio"
                  className="h-4 w-4 accent-indigo-600"
                />
                필독 (상단 고정)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  onChange={handleChange}
                  value="N"
                  checked={is_pinned === "N"}
                  name="is_pinned"
                  type="radio"
                  className="h-4 w-4 accent-indigo-600"
                />
                일반
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={label}>제목</label>

            <input
              onChange={handleChange}
              value={title}
              name="title"
              type="text"
              placeholder="제목을 입력하세요"
              className={`${input} w-full`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={label}>내용</label>

            <textarea
              onChange={handleChange}
              value={content}
              name="content"
              rows={12}
              placeholder="내용을 입력하세요"
              className={`${input} w-full resize-none leading-6`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={() => navigate(-1)} type="button" className={btnSecondary}>
            취소
          </button>

          {!notice ? (
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

export default NoticeForm;
