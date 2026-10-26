export type DepartmentBrief = {
  id: number;
  name: string;
};

export type AdminUserUpdate = {
  role?: string;
  position?: string;
  department_id?: number;
};

export type AdminUserResponse = {
  id: number;
  email: string;
  name: string;
  role: string;
  position: string;
  department: DepartmentBrief | null;
};

export type AdminUserPageResponse = {
  items: AdminUserResponse[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
};
