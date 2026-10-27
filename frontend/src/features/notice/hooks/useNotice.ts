// 전체 페이지에 보내줄 page, size 와 주소단

import { useEffect, useState } from "react";
import type { NoticeResponse } from "../types/notice";
import { get_notice } from "../apis/noticeApi";

// useState 가 불러올 때 데이터 기본값 정의
export const BaseNotice: NoticeResponse = {
  id: 0,
  author_id: 0,
  title: "",
  content: "",
  is_pinned: "N",
  created_at: "",
  updated_at: "",
  author: { id: 0, name: "" },
};
const useNotice = (id: string | undefined) => {
  // useState 를 사용해 값 변경 받기
  const [data, setData] = useState<NoticeResponse>(BaseNotice);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // api로 요청 보내기
        const serverData = await get_notice(id);
        setData(serverData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  // 밖으로 보내주기
  return data;
};

export default useNotice;
