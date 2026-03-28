"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRows,
  rowsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const t = useTranslations("common");
  const [pageInput, setPageInput] = useState(currentPage.toString());

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handleInputBlur = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  if (totalRows === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="size-8"
        >
          <Icon icon="solar:double-alt-arrow-left-outline" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="size-8"
        >
          <Icon icon="solar:alt-arrow-left-outline" />
        </Button>

        <div className="flex items-center gap-2 px-2">
          <Input
            type="text"
            value={pageInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="h-8 w-12 rounded-md text-center text-sm p-0 text-foreground"
          />
          <span className="text-foreground text-sm whitespace-nowrap">
            {t("pagination.from")} {totalPages}
          </span>
        </div>

        <Button
          variant="secondary"
          size="icon"
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="size-8"
        >
          <Icon icon="solar:alt-arrow-right-outline" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="size-8"
        >
          <Icon icon="solar:double-alt-arrow-right-outline" />
        </Button>
      </div>

      <div className="text-sm text-subdude">
        {t("pagination.show")} {(currentPage - 1) * rowsPerPage + 1} -{" "}
        {Math.min(currentPage * rowsPerPage, totalRows)} {t("pagination.from")}{" "}
        {totalRows} {t("pagination.total")}
      </div>
    </div>
  );
}
