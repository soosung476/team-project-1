// 전체 페이지에 보내줄 page, size 와 주소단

import { useEffect, useState } from "react";
import type { NoticeListResponse } from "../types/notice";
import { get_notices } from "../apis/noticeApi";

// useState 가 불러올 때 데이터 기본값 정의
export const BaseNotices: NoticeListResponse = {
  items: [],
  page: 1,
  size: 10,
  total: 1,
  total_pages: 0,
};

const useNotices = (page: number, size: number) => {
  // useState 를 사용해 값 변경 받기
  const [data, setData] = useState<NoticeListResponse>(BaseNotices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // api로 요청 보내기
        const serverData = await get_notices(page, size);
        setData(serverData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page, size]);
  // 밖으로 보내주기
  return data;
};

export default useNotices;
