"use client";

interface Props {
  currentPage: number;

  totalPages: number;

  setCurrentPage: (
    page: number
  ) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  return (
    <div
      className="flex justify-center gap-3 mt-12"
    >
      {[...Array(totalPages)].map(
        (_, index) => (
          <button
            key={index}
            onClick={() =>
              setCurrentPage(
                index + 1
              )
            }
            className={`
              h-12
              w-12
              rounded-xl
              border
              ${
                currentPage ===
                index + 1
                  ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                  : "border-[#E8DCC1]"
              }
            `}
          >
            {index + 1}
          </button>
        )
      )}
    </div>
  );
}