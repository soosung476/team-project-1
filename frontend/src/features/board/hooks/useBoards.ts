import { useEffect, useState } from "react";
import type { BoardPageRespons } from "../types/board";
import { getBoards } from "../apis/boardApi";

export const initialBoardPage: BoardPageRespons = {
  items: [],
  total: 0,
  page: 1,
  size: 10,
  total_pages: 0,
  criteria: "",
  keyword: "",
};
const useBoards = (
  page: number,
  size: number,
  criteria: string,
  keyword: string,
) => {
  const [data, setData] = useState<BoardPageRespons>(initialBoardPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serverData = await getBoards(page, size, criteria, keyword);
        setData(serverData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, size, criteria, keyword]);

  return { data, loading };
};

export default useBoards;
