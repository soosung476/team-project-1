type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  start: number;
  end: number;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  start,
  end,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* 이전 버튼 */}

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
            px-3 py-2
            rounded-md
            text-sm
            border border-gray-200
            bg-white
            text-gray-600
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
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
            className={`
                w-9 h-9
                rounded-md
                text-sm
                font-medium
                ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
                           
                        `}
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
        className="
            px-3 py-2
            rounded-md
            text-sm
            border border-gray-200
            bg-white
            text-gray-600
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
