import axios from "axios";
 
// 에러에서 화면에 띄울 문구 꺼내기
// 백엔드 detail = { code, message } 면 그 message, 아니면 fallback 문구
export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
 
    // 우리가 HTTPException 으로 보낸 에러 (400, 403, 404, 409 등)
    if (detail && typeof detail === "object" && "message" in detail) {
      return String(detail.message);
    }
    // Pydantic 형식 에러는 detail 이 배열이라 따로
    if (err.response?.status === 422) {
      return "입력값을 확인해 주세요.";
    }
  }
  // 서버 꺼짐, 500 등 나머지 전부
  return fallback;
};
 
// 상태코드만 필요할 때 (409면 새로고침 같은거)
export const getErrorStatus = (err: unknown): number | undefined => {
  if (axios.isAxiosError(err)) {
    return err.response?.status;
  }
  return undefined;
};