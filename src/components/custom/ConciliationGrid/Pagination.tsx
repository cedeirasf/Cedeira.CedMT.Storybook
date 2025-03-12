import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagination: {
    page: number;
    rows: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions: number[];
  isLoading?: boolean; // Añadida la prop isLoading como opcional
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <span>
          Página {pagination.page} de {pagination.pages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || isLoading}
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages || isLoading}
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Registros por página
        </span>
        <Select
          value={pagination.rows.toString()}
          onValueChange={(value) => onRowsPerPageChange(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger
            className={cn(
              "w-[70px]",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <SelectValue>{pagination.rows}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
