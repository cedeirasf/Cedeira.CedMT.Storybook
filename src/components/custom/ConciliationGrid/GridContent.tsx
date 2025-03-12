import type {
  ConditionalRowFormat,
  Source,
} from "@/types/components/custom-table-conciliation-type";
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { memo, useEffect, useMemo, useRef } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { TableCell } from "./TableCell";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

interface GridContentProps {
  source: Source;
  currentPage: number;
  conditionalRowFormat: ConditionalRowFormat[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  syncScroll: boolean;
  rowsPerPage: number;
  scrollRef: (el: HTMLDivElement | null) => void;
  isLoading?: boolean;
  displayVerticalScroll?: boolean;
  onSort: (column: string) => void;
  sortState: { column: string | null; direction: "asc" | "desc" };
}

const ROW_HEIGHT = 40;
const columnHelper = createColumnHelper<Record<string, unknown>>();

const GridContentInner: React.FC<GridContentProps> = memo(
  ({
    source,
    currentPage,
    conditionalRowFormat,
    syncScroll,
    rowsPerPage,
    scrollRef,
    onScroll,
    isLoading = false,
    onSort,
    sortState,
    displayVerticalScroll,
  }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLTableElement>(null);

    const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
      const response: ColumnDef<Record<string, unknown>>[] = [];

      for (const [key, column] of Object.entries(source.body.scheme)) {
        if (column.behaviors.visible) {
          response.push(
            columnHelper.accessor(key, {
              header: () => (
                <div
                  className="cursor-pointer select-none"
                  onClick={() => onSort(key)}
                >
                  {column.display}
                  {sortState.column === key && (
                    <span className="ml-2">
                      {sortState.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              ),
              cell: (info) => (
                <TableCell
                  columnKey={key}
                  column={column}
                  value={info.getValue() as string | number | null}
                  isUpdated={false}
                />
              ),
            })
          );
        }
      }

      return response;
    }, [source.body.scheme, columnHelper, onSort, sortState]);

    const data = useMemo(() => {
      return source.body.datarows;
    }, [source.body.datarows]);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => tableContainerRef.current,
      estimateSize: () => ROW_HEIGHT,
      overscan: 20,
    });

    useEffect(() => {
      if (parentRef.current) {
        scrollRef(parentRef.current);
      }
    }, [scrollRef]);

    if (!source.body.scheme || (!isLoading && !source.body.datarows.length)) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {source.display && (
          <div
            className={cn(
              "border-b",
              source.behaviors.isSticky && "sticky top-0 z-10"
            )}
          >
            <div className="px-4 py-1 font-medium text-sm text-muted-foreground border-b">
              {source.display}
            </div>
          </div>
        )}
        <div
          ref={parentRef}
          onScroll={syncScroll ? onScroll : undefined}
          className={cn(
            "overflow-auto h-full",
            !displayVerticalScroll && "vertical-scrollbar-hide"
          )}
        >
          <div
            ref={tableContainerRef}
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <table style={{ width: "100%" }}>
              <TableHeader headerGroups={table.getHeaderGroups()} />
              <TableBody
                virtualizer={virtualizer}
                table={table}
                conditionalRowFormat={conditionalRowFormat}
                isLoading={isLoading}
                baseIndex={(currentPage - 1) * rowsPerPage}
              />
            </table>
          </div>
        </div>
      </div>
    );
  }
);

export const GridContent: React.FC<GridContentProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="h-full flex flex-col">
          <div
            className={cn(
              "border-b",
              props.source.behaviors.isSticky && "sticky top-0 z-10"
            )}
          >
            <div className="px-4 py-1 font-medium text-sm border-">
              {props.source.display}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-card-foreground">
            Error al cargar los datos. Por favor, intente nuevamente.
          </div>
        </div>
      }
    >
      <GridContentInner {...props} />
    </ErrorBoundary>
  );
};
