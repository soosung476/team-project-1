import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { putBoard } from "../apis/boardApi";
import BoardForm from "../components/BoardForm";
import useBoard from "../hooks/useBoard";
import type { BoardUpdate } from "../types/board";

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { board, loading } = useBoard(id);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page"));
  const size = Number(searchParams.get("size"));

  if (loading) {
    return <p>Loading....</p>;
  }
  if (!board) {
    return;
  }

  const onSubmit = async (board: BoardUpdate) => {
    if (!id) return;
    try {
      const result = await putBoard(id, board);
      console.log("수정된 board:", result);
      navigate({
        pathname: `/boards/${id}`,
        search: `?page=${currentPage}&size=${size}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <BoardForm onSubmit={onSubmit} board={board} />
    </div>
  );
};

export default BoardEdit;
