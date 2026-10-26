import { useEffect, useState } from "react";
import { getApprovalList } from "../apis/approvalApi";
import type { ApprovalPageResponse } from "../types/approval";

export const initialApprovals: ApprovalPageResponse = {
  items: [],
  total: 0,
  page: 1,
  size: 10,
  total_pages: 0,
};
const useApprovals = (
  listType: string,
  page: number,
  size: number,
  criteria: string,
  keyword: string,
) => {
  const [data, setData] = useState<ApprovalPageResponse>(initialApprovals);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getApprovalList(
          listType,
          page,
          size,
          criteria,
          keyword,
        );
        setData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [listType, page, criteria, size, keyword]);

  return { data, loading };
};

export default useApprovals;
