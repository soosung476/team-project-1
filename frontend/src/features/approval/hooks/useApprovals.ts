import { useEffect, useState } from "react";
import type { ApprovalListItem } from "../types/approval";
import {
  getApproved,
  getDrafted,
  getPending,
  getRejected,
} from "../apis/approvalApi";

const useApprovals = (listType: string) => {
  const [items, setItems] = useState<ApprovalListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data: ApprovalListItem[] = [];
        if (listType === "pending") {
          data = await getPending();
        } else if (listType === "drafted") {
          data = await getDrafted();
        } else if (listType === "approved") {
          data = await getApproved();
        } else if (listType === "rejected") {
          data = await getRejected();
        }
        setItems(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [listType]);

  return { items, loading };
};

export default useApprovals;
