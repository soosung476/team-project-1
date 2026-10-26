import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { put_notice } from "../apis/noticeApi";
import NoticeForm from "../components/NoticeForm";
import useNotice from "../hooks/useNotice";
import type { NoticeUpdate } from "../types/notice";

const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useNotice(id);

  const [searchParams] = useSearchParams();
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  const onSubmit = async (data: NoticeUpdate) => {
    if (!id) return;

    try {
      const result = await put_notice(data, id);
      console.log(result);

      navigate({
        pathname: `/notices/${id}`,
        search: `?page=${Page}&size=${Size}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <NoticeForm onSubmit={onSubmit} notice={data} />
    </div>
  );
};

export default NoticeEdit;
