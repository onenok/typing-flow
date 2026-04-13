interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {


  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-white"
      >
        上一頁
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-10 w-10 rounded-full font-bold transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-white"
      >
        下一頁
      </button>
    </div>
  );
}
