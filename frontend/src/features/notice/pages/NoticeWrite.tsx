import { useNavigate, useSearchParams } from "react-router-dom";
import { post_notice } from "../apis/noticeApi";
import NoticeForm from "../components/NoticeForm";
import type { NoticeCreate } from "../types/notice";

const NoticeWrite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const size = Number(searchParams.get("size")) || 10;

  // 자식이 보내준 form 안의 데이터를 받아 전송
  // 최초 작성시에는 첫번째 페이지로 전달
  const onSubmit = async (data: NoticeCreate) => {
    try {
      const result = await post_notice(data);
      console.log(result);
      navigate(`/notices?page=${1}&size=${size}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // NoticeForm 에게 기존데이터 전달
    <div>
      <NoticeForm onSubmit={onSubmit} />
    </div>
  );
};

export default NoticeWrite;
