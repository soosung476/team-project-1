import { useNavigate, useSearchParams } from "react-router-dom";
import { post_notice } from "../apis/noticeApi";
import NoticeForm from "../components/NoticeForm";
import type { NoticeCreate } from "../types/notice";

const NoticeWrite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const size = Number(searchParams.get("size")) || 10;

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
    <div>
      <NoticeForm onSubmit={onSubmit} />
    </div>
  );
};

export default NoticeWrite;
