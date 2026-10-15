export type UserLogin = {
  email: string;
  password: string;
};
export type User = {
  user_id: number;
  email: string;
  name: string;
};

export type UserSignup = {
  email: string;
  password: string;
  name: string;
  passwordCheck: string;
};

export type UserCreate = {
  email: string;
  password: string;
  name: string;
};
