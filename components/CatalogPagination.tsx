import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({ currentPage, totalPages, onPageChange }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              currentPage === page
                ? 'bg-[#8DFF00] text-[#0a0a0a] border border-[#8DFF00] shadow-md shadow-[#8DFF00]/20'
                : 'bg-card/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
