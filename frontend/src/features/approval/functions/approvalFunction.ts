export const statusLabel = (status: string) => {
  if (status === "APPROVED") return "승인됨";
  if (status === "REJECTED") return "반려됨";
  return "진행중";
};
export const statusColor = (status: string) => {
  if (status === "APPROVED") return "text-green-600 bg-green-50";
  if (status === "REJECTED") return "text-red-600 bg-red-50";
  return "text-blue-600 bg-blue-50";
};
