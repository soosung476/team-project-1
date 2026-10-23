export type AuthorBrief = {
  id: number;
  name: string;
};

export type CommentResponse = {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  author: AuthorBrief;
  created_at: string;
};

export type BoardCreate = {
  title: string;
  content: string;
};

export type BoardUpdate = {
  title: string;
  content: string;
};

export type CommentCreate = {
  content: string;
};

export type CommentUpdate = {
  content: string;
};

export type BoardResponse = {
  id: number;
  author_id: number;
  title: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  author: AuthorBrief;
  comments: CommentResponse[];
};

export type BoardListItem = {
  id: number;
  title: string;
  view_count: number;
  created_at: string;
  author: AuthorBrief;
};

export type BoardPageRespons = {
  items: BoardListItem[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
  criteria: string;
  keyword: string;
};
