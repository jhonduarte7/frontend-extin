import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Reusable classic pagination component for Equi-Extin Admin data tables.
 *
 * @param {number} currentPage - Current 1-based page index
 * @param {number} totalPages - Total calculated page count
 * @param {number} totalItems - Total records matching active filters
 * @param {number} pageSize - Number of records displayed per page (default: 5)
 * @param {function} onPageChange - Callback triggered with the new page index: (newPage) => void
 * @param {boolean} [isLoading=false] - Optional loading state to disable controls during network operations
 * @param {string} [className=''] - Optional wrapper CSS class overrides
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize: _pageSize = 5,
  onPageChange,
  isLoading = false,
  className = '',
}) {
  const { t } = useTranslation();

  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const isFirstDisabled = safeCurrentPage <= 1 || isLoading;
  const isPrevDisabled = safeCurrentPage <= 1 || isLoading;
  const isNextDisabled = safeCurrentPage >= safeTotalPages || isLoading;
  const isLastDisabled = safeCurrentPage >= safeTotalPages || isLoading;

  const handleFirst = () => {
    if (!isFirstDisabled && onPageChange) {
      onPageChange(1);
    }
  };

  const handlePrev = () => {
    if (!isPrevDisabled && onPageChange) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isNextDisabled && onPageChange) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handleLast = () => {
    if (!isLastDisabled && onPageChange) {
      onPageChange(safeTotalPages);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs ${className}`}
    >
      {/* Visual Text Indicator */}
      <div className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5 order-2 sm:order-1">
        <span>
          {t('pagination.pageOf', 'Página {{current}} de {{total}}', {
            current: safeCurrentPage,
            total: safeTotalPages,
          })}
        </span>
        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
          {t('pagination.totalRecords', '(Total: {{count}} registros)', {
            count: totalItems,
          })}
        </span>
      </div>

      {/* Classic Navigation Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* 1. Inicio (<<) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFirst}
          disabled={isFirstDisabled}
          title={t('pagination.first', 'Inicio (<<)')}
          className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs gap-1"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-bold">
            {t('pagination.first', 'Inicio')}
          </span>
        </Button>

        {/* 2. Anterior (<) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          title={t('pagination.prev', 'Anterior (<)')}
          className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-bold">
            {t('pagination.prev', 'Anterior')}
          </span>
        </Button>

        {/* Numeric Pill for active page badge */}
        <div className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold font-mono text-[11px] border border-slate-200 dark:border-slate-700 min-w-[28px] text-center">
          {safeCurrentPage}
        </div>

        {/* 3. Siguiente (>) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isNextDisabled}
          title={t('pagination.next', 'Siguiente (>)')}
          className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs gap-1"
        >
          <span className="hidden sm:inline text-[11px] font-bold">
            {t('pagination.next', 'Siguiente')}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>

        {/* 4. Final (>>) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLast}
          disabled={isLastDisabled}
          title={t('pagination.last', 'Final (>>)')}
          className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs gap-1"
        >
          <span className="hidden md:inline text-[11px] font-bold">
            {t('pagination.last', 'Final')}
          </span>
          <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
