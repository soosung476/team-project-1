import { useEffect, useState } from "react";
import { getApproval } from "../apis/approvalApi";
import type { ApprovalResponse } from "../types/approval";

const useApprovalDetail = (id: number) => {
  const [items, setItems] = useState<ApprovalResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const approvalData = await getApproval(id);
      setItems(approvalData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  return { items, loading, refresh: fetchData };
};

export default useApprovalDetail;
