export type ApprovalStatusUpdate = {
  status: string;
};

export type ApprovalCreate = {
  title: string;
  content: string;
  approver_id: number;
};

export type UserBrief = {
  id: number;
  name: string;
  position: string;
};

// 목록 한 줄 (content 없음)
export type ApprovalListItem = {
  id: number;
  title: string;
  status: string;
  created_at: string;
  completed_at: string | null; // 처리 전에는 null
  drafter: UserBrief;
  approver: UserBrief;
};

export type ApprovalResponse = ApprovalListItem & {
  content: string;
};
