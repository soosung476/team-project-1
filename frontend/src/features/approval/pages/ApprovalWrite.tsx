import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApproval, getApprovers, postApproval } from "../apis/approvalApi";
import type {
  ApprovalCreate,
  ApprovalResponse,
  UserBrief,
} from "../types/approval";
import PageHeader from "../../../common/components/PageHeader";
import {
  btnPrimary,
  btnSecondary,
  card,
  input,
  label,
} from "../../../common/style";

// 기안하기
const ApprovalWrite = () => {
  const [searchParams] = useSearchParams();
  const fromId = searchParams.get("from");
  const navigate = useNavigate();
  const [form, setForm] = useState<ApprovalCreate>({
    title: "",
    content: "",
    approver_id: 0,
  });
  const [original, setOriginal] = useState<ApprovalCreate | null>(null);
  const [approverList, setApproverList] = useState<UserBrief[]>([]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // 공백만 있는 제목·내용도 막음 (trim 없이 === ""만 보면 "   "은 통과해서 빈칸 기안이 저장됨)
    if (
      form.approver_id === 0 ||
      form.title.trim() === "" ||
      form.content.trim() === ""
    ) {
      alert("내용을 전부 채워주세요");
      return;
    }
    try {
      await postApproval(form);
      navigate("/approvals");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fromId) {
          const defaultData: ApprovalResponse = await getApproval(
            Number(fromId),
          );
          const loaded = {
            title: defaultData.title,
            content: defaultData.content,
            approver_id: defaultData.approver.id,
          };
          setForm(loaded);
          setOriginal(loaded);
        }
        const data = await getApprovers();
        setApproverList(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.detail);
        }
        console.log(error);
      }
    };
    fetchData();
  }, [fromId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "approver_id") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isUnchanged =
    original !== null &&
    form.title.trim() === original.title.trim() &&
    form.content.trim() === original.content.trim() &&
    form.approver_id === original.approver_id;
  return (
    <div>
      {/* 반려된 문서에서 「재작성」으로 들어오면(?from=번호) 제목·설명을 바꿔서 알려줌 */}
      <PageHeader
        title={fromId ? "다시 기안하기" : "기안하기"}
        description={
          fromId
            ? "반려된 문서의 내용을 불러왔습니다. 고친 뒤 다시 기안하세요."
            : "결재 받을 문서를 작성해주세요."
        }
        breadcrumb={["전자결재", fromId ? "다시 기안하기" : "기안하기"]}
      />

      <form onSubmit={handleSubmit} className={card}>
        <div className="space-y-5 p-6">
          {/* Approver */}
          <div>
            <label className={label}>결재자</label>

            <select
              name="approver_id"
              value={form.approver_id}
              onChange={handleChange}
              className={`${input} w-full`}
            >
              <option value={0}>결재자를 선택하세요</option>
              {/* 다른 화면과 같은 순서: 이름 직급 */}
              {approverList.map((approver) => (
                <option key={approver.id} value={approver.id}>
                  {approver.name} {approver.position}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className={label}>제목</label>

            <input
              name="title"
              value={form.title}
              type="text"
              onChange={handleChange}
              // 서버 스키마가 200자까지라 넘으면 422(alert에 [object Object])가 나서 입력부터 막음
              maxLength={200}
              placeholder="제목을 입력하세요"
              className={`${input} w-full`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={label}>내용</label>

            <textarea
              name="content"
              value={form.content}
              rows={12}
              onChange={handleChange}
              // 서버·DB에는 길이 제한이 없어서 화면에서 5000자로 막음
              maxLength={5000}
              placeholder="내용을 입력하세요"
              className={`${input} w-full resize-none leading-6`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-slate-100 px-6 py-4">
          {/* 재작성인데 바뀐 내용이 없으면 기안 버튼 위에 안내 메세지 보여주기 (로그인 에러 메세지와 같은 모양)
              w-fit: 배경을 글자 길이만큼만, ml-auto: 오른쪽(기안 버튼 쪽)으로 붙임 */}
          {isUnchanged && (
            <div className="mb-3 ml-auto w-fit rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
              바뀐 내용이 없습니다.
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button type="submit" className={btnPrimary} disabled={isUnchanged}>
              기안
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApprovalWrite;
