// 기안하기
const ApprovalWrite = () => {
  return (
    <div>
      <div className="mb-3 text-sm text-slate-400">
        Home <span className="mx-2">/</span>
        전자결재 <span className="mx-2">/</span>
        <span className="text-slate-600">기안하기</span>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">기안하기</h1>
        <p className="mt-1 text-sm text-slate-500">
          결재 받을 문서를 작성해주세요.
        </p>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-6">
        {/* Approver */}
        <div>
          <label className="mb-2 block text-sm font-semibold">결재자</label>

          <select
            name="approver_id"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={0}>결재자를 선택하세요</option>
          </select>
        </div>

        {/* Title */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold">제목</label>

          <input
            name="title"
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Content */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold">내용</label>

          <textarea
            name="content"
            rows={10}
            placeholder="내용을 입력하세요"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            기안
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApprovalWrite;
