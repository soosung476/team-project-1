import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, signin } from "../apis/userApi";
import { useAuth } from "../context/AuthContext";
import type { UserLogin } from "../types/user";
import { btnPrimary, input, label } from "../../../common/style";

const LoginPage = () => {
  //   const navigate = useNavigate();

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState<UserLogin>({
    email: "",
    password: "",
  });
  // 로그인 실패 안내 (회원가입 화면의 errorMessage와 같은 방식)
  const [errorMessage, setErrorMessage] = useState("");
  const { email, password } = loginForm;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signin(loginForm);
      console.log(result);
      sessionStorage.setItem("access_token", result.access_token);
      const currentUser = await getCurrentUser();
      console.log(currentUser);

      login(currentUser);
      navigate("/");
    } catch (error) {
      console.log(error);
      // 서버가 답을 주면 그 이유(예: "이메일, 비밀번호를 확인해주세요"), 답이 없으면 연결 문제
      if (axios.isAxiosError(error) && error.response) {
        const detail = error.response.data.detail;
        // 입력 형식 오류(422)는 detail이 글자가 아니라 배열이라 그대로 못 보여줌 → 안내 문장으로 바꿈
        setErrorMessage(typeof detail === "string" ? detail : "이메일 형식을 확인해주세요.");
      } else {
        setErrorMessage("서버에 연결할 수 없습니다.");
      }
    }
  };

  return (
    // 바깥 레이아웃(AuthLayout)이 화면 가운데 자리를 잡아 줌
    <div>
      <h1 className="text-2xl font-bold tracking-tight">로그인</h1>

      <p className="mt-1 mb-8 text-sm text-slate-500">팀웍스 계정으로 로그인하세요.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={label}>이메일</label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            className={`${input} w-full`}
          />
        </div>

        <div>
          <label className={label}>비밀번호</label>

          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            placeholder="비밀번호"
            className={`${input} w-full`}
          />
        </div>

        {/* 로그인 실패시 에러 메세지 보여주기 */}
        {errorMessage && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <button type="submit" className={`${btnPrimary} w-full`}>
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        계정이 없으신가요?{" "}
        <Link
          to="/users/signup"
          className="font-medium text-indigo-600 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
