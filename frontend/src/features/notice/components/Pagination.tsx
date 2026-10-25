type PaginaitonProps = {
  currentPage: number;
  start: number;
  end: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, start, end, totalPages, onPageChange }: PaginaitonProps) => {
  if (totalPages <= 1) return null;
  return (
    // 뒷페이지 가는 버튼, 앞페이지 가는 버튼, 페이지 리스트
    <div>
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
      {Array.from({ length: end - start + 1 }, (_, i) => {
        const pageNum = i + start;
        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`
                    w-9 h-9
                    rounded-md
                    text-sm
                    font-medium
                     ${currentPage === pageNum ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
                            `}
          >
            {pageNum}
          </button>
        );
      })}
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
