import { useEffect, useState } from "react";
import { getBoard } from "../apis/boardApi";
import type { BoardResponse } from "../types/board";

export const initialBoard: BoardResponse = {
  id: 0,
  author_id: 0,
  title: "",
  content: "",
  view_count: 0,
  created_at: "",
  updated_at: "",
  author: { id: 0, name: "" },
  comments: [],
};

const useBoard = (id: string | undefined) => {
  const [board, setBoard] = useState<BoardResponse>(initialBoard);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;

    try {
      const serverData = await getBoard(id);
      setBoard(serverData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  return { board, loading, refresh: fetchData };
};

export default useBoard;
