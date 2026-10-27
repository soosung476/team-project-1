type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  start: number;
  end: number;
};

// 이전·다음 버튼 모양 (둘이 같음)
const arrowButton =
  "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  start,
  end,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      {/* 이전 버튼 */}

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={arrowButton}
      >
        ‹
      </button>
      {/* 페이지 번호 */}

      {Array.from({ length: end-start+1 }, (_, i) => {
        const pageNumber = i + start;
        return (
          <button
            type="button"
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium transition ${
              currentPage === pageNumber
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={arrowButton}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
