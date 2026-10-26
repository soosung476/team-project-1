export type UserResponse = {
  id: number;
  name: string;
};

export type NoticeCreate = {
  title: string;
  content: string;
  is_pinned: "Y" | "N";
};
export type NoticeUpdate = {
  title?: string;
  content?: string;
  is_pinned?: "Y" | "N";
};
export type NoticeResponse = {
  id: number;
  author_id: number;
  title: string;
  content: string;
  is_pinned: "Y" | "N";
  created_at: string;
  updated_at: string;
  author: UserResponse;
};
export type NoticeListResponse = {
  items: NoticeResponse[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
};
