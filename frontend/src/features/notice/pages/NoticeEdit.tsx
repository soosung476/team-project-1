import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { put_notice } from "../apis/noticeApi";
import NoticeForm from "../components/NoticeForm";
import useNotice from "../hooks/useNotice";
import type { NoticeUpdate } from "../types/notice";

const NoticeEdit = () => {
  // 주소창에서 id 가져오기
  const { id } = useParams();
  const navigate = useNavigate();
  // id를 통해 수정할 게시글 상세데이터 조회
  const data = useNotice(id);
  // 주소단 파라미터 page,size의 값 가져오기 / 기본값 1,10
  const [searchParams] = useSearchParams();
  const Page = Number(searchParams.get("page")) || 1;
  const Size = Number(searchParams.get("size")) || 10;

  // 자식(NoticeForm)이 onSubmit에 전달해 준 내용을 받아
  // NoticeUpdate 의 모양으로 데이터 보내 수정
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
    // NoticeForm 에게 기존 데이터 전달
    <div>
      <NoticeForm onSubmit={onSubmit} notice={data} />
    </div>
  );
};

export default NoticeEdit;
