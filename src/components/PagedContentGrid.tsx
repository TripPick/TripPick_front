import { useState } from "react";
import ContentGrid from "./ContentGrid";
import { Button } from "@/components/ui/button";
import type { CommonContentDto } from "@/api/Dto";

interface PagedContentGridProps {
  items: CommonContentDto[]; // 배열 타입 명시
  itemsPerPage?: number; // optional + 기본값 있음
}

export default function PagedContentGrid({
  items,
  itemsPerPage = 16,
}: PagedContentGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedItems = items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="space-y-8">
      <ContentGrid items={pagedItems} />

      {/* 페이지 버튼 */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === idx + 1 ? "bg-primary text-white" : "bg-gray-100"
            }`}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
