import { useNavigate, useSearchParams } from "react-router-dom";
import { postBoard } from "../apis/boardApi";
import BoardForm from "../components/BoardForm";
import { type BoardCreate } from "../types/board";

const BoardWrite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const size = Number(searchParams.get("size")) || 10;
  const onSubmit = async (board: BoardCreate) => {
    try {
      const result = await postBoard(board);
      console.log(result);
      navigate(`/boards?page=1&size=${size}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Form */}

      <BoardForm onSubmit={onSubmit} />
    </div>
  );
};

export default BoardWrite;
