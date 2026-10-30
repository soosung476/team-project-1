import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NoticeCreate, NoticeUpdate } from "../types/notice";
import PageHeader from "../../../common/components/PageHeader";
import { btnPrimary, btnSecondary, card, input, label } from "../../../common/style";

// 부모(Write,Edit)로부터 전달받은 data가 있다면 - 수정, 없다면 - 작성
const NoticeForm = ({ onSubmit, notice }: { onSubmit: (notice: NoticeUpdate) => void; notice?: NoticeCreate }) => {
  const navigate = useNavigate();
  // useState 초기값 설정
  const [form, setForm] = useState<NoticeCreate>(
    notice ?? {
      title: "",
      content: "",
      is_pinned: "N",
    },
  );
  // form 안의 값을 꺼내서 사용
  const { title, content, is_pinned } = form;
  // 제목·내용이 비면 Oracle이 ''를 NULL로 저장하려다 서버 500 오류가 나서 버튼을 막음
  const isInvalid = title.trim() === "" || content.trim() === "";

  // 수정 하면 서버에서 받아 온 내용을 form 상태에 동기화
  useEffect(() => {
    if (notice)
      setForm({
        title: notice.title,
        content: notice.content,
        is_pinned: notice.is_pinned,
      });
  }, [notice]);

  // 기존 form의 내용 복사 후, 수정 시 실시간 반영해 form 에 저장
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
        <PageHeader
          title="공지 작성"
          description="전 직원에게 알릴 공지를 작성해주세요."
          breadcrumb={["공지사항", "글쓰기"]}
        />
      ) : (
        <PageHeader title="공지 수정" description="공지 내용을 수정해주세요." breadcrumb={["공지사항", "수정"]} />
      )}

      {/* handleChange 가 form 에 저장해 둔 값을 부모에게 전송 */}
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
              // 제목은 DB에 String(200)이라 200자까지만 입력
              maxLength={200}
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
              // 서버·DB에는 길이 제한이 없어서 화면에서 5000자로 막음
              maxLength={5000}
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

          {/* 버튼을 누르면 onSubmit */}
          {!notice ? (
            <button type="submit" disabled={isInvalid} className={btnPrimary}>
              작성
            </button>
          ) : (
            <button type="submit" disabled={isInvalid} className={btnPrimary}>
              수정
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
