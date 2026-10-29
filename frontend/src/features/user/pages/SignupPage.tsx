import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../apis/userApi";
import type { UserSignup } from "../types/user";
import { btnPrimary, input, label } from "../../../common/style";

const SignupPage = () => {
  const navigate = useNavigate();
  // 에러메세지

  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<UserSignup>({
    email: "",
    password: "",
    name: "",
    passwordCheck: "",
  });
  const { email, password, name, passwordCheck } = form;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // setErrorMessage("");

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        () =>
          "비밀번호는 8~64자, 대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 각각 1자 이상 포함해야 합니다.",
      );

      return;
    }
    if (password != passwordCheck) {
      setErrorMessage(() => "비밀번호가 다릅니다.");
      setForm((prev) => ({ ...prev, password: "", passwordCheck: "" }));
      return;
    }

    try {
      const result = await signup({ email, password, name });
      alert(`${name}님 ${result.message}`);
      navigate("/users/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data.detail;
        if (Array.isArray(detail)) {
          setErrorMessage(
            detail[0].msg ?? "비밀번호 입력값이 올바르지 않습니다.",
          );
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
      }
    }
  };

  return (
    // 바깥 레이아웃(AuthLayout)이 화면 가운데 자리를 잡아 줌
    <div>
      <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>

      <p className="mt-1 mb-8 text-sm text-slate-500">
        팀웍스 계정을 만들어 보세요. 부서·직급은 관리자가 지정합니다.
      </p>

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
          <label className={label}>이름</label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
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
            className={`${input} w-full`}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            8~64자, 대문자·소문자·숫자·특수문자(!@#$%^&*)를 각각 1자 이상
          </p>
        </div>

        <div>
          <label className={label}>비밀번호 확인</label>

          <input
            type="password"
            name="passwordCheck"
            value={passwordCheck}
            onChange={handleChange}
            required
            className={`${input} w-full`}
          />
        </div>

        {/* 가입 실패시 에러 메세지 보여주기 */}
        {errorMessage && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <button type="submit" className={`${btnPrimary} w-full`}>
          회원가입
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link
          to="/users/signin"
          className="font-medium text-indigo-600 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
