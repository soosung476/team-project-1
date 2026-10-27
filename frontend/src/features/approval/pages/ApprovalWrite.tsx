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
  const [approverList, setApproverList] = useState<UserBrief[]>([]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (form.approver_id === 0 || form.title === "" || form.content === "") {
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
          setForm(() => ({
            title: defaultData.title,
            content: defaultData.content,
            approver_id: defaultData.approver.id,
          }));
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
              placeholder="내용을 입력하세요"
              className={`${input} w-full resize-none leading-6`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className={btnPrimary}>
            기안
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApprovalWrite;
