import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  ConditionalRowFormat,
  Source,
} from "@/types/components/custom-table-conciliation-type";
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { TableCell } from "./TableCell";
import { TableHeader } from "./TableHeader";

interface GridContentProps {
  source: Source;
  currentPage: number;
  conditionalRowFormat: ConditionalRowFormat[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  syncScroll: boolean;
  rowsPerPage: number;
  scrollRef: (el: HTMLDivElement | null) => void;
  isLoading?: boolean;
  onSort: (column: string) => void;
  sortState: { column: string | null; direction: "asc" | "desc" };
}

const ROW_HEIGHT = 52; // Altura fija de cada fila

const GridContentInner: React.FC<GridContentProps> = memo(
  ({
    source,
    currentPage,
    conditionalRowFormat,
    onScroll,
    syncScroll,
    rowsPerPage,
    scrollRef,
    isLoading = false,
    onSort,
    sortState,
  }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    const columnHelper = createColumnHelper<Record<string, unknown>>();

    const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
      return Object.entries(source.body.scheme)
        .filter(([, column]) => column.behaviors.visible)
        .map(([key, column]) => {
          return columnHelper.accessor(key, {
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
          });
        });
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
      getScrollElement: () => parentRef.current,
      estimateSize: () => ROW_HEIGHT,
      overscan: 10,
    });

    const virtualRows = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom =
      virtualRows.length > 0
        ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
        : 0;

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

    const baseIndex = (currentPage - 1) * rowsPerPage;

    return (
      <div className="h-full flex flex-col">
        <div
          className={cn(
            "bg-white border-b border-gray-200",
            source.behaviors.isSticky && "sticky top-0 z-10"
          )}
        >
          <div className="px-4 py-1 font-medium text-sm border-b border-gray-200">
            {source.display}
          </div>
        </div>
        <div
          ref={parentRef}
          className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          onScroll={syncScroll ? onScroll : undefined}
          style={{
            height: `calc(100% - ${
              source.behaviors.isSticky ? "32px" : "0px"
            })`,
          }}
        >
          <table
            ref={tableRef}
            className="w-full border-separate border-spacing-0"
          >
            <TableHeader scheme={source.body.scheme} />
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingTop}px` }}
                    colSpan={columns.length}
                  />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                const rowIndex = virtualRow.index + baseIndex;
                const matchingFormat = conditionalRowFormat.find((format) =>
                  format["index-rows"].includes(rowIndex + 1)
                );
                const baseStyles = matchingFormat
                  ? matchingFormat.styles.join(" ")
                  : "";

                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className={cn(
                      baseStyles,
                      "transition-all duration-700 hover:bg-gray-50 relative"
                    )}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-200"
                        )}
                        role="cell"
                      >
                        {isLoading ? (
                          <Skeleton className="h-4 w-full" />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingBottom}px` }}
                    colSpan={columns.length}
                  />
                </tr>
              )}
            </tbody>
          </table>
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
              "bg-white border-b border-gray-200",
              props.source.behaviors.isSticky && "sticky top-0 z-10"
            )}
          >
            <div className="px-4 py-1 font-medium text-sm border-b border-gray-200">
              {props.source.display}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Error al cargar los datos. Por favor, intente nuevamente.
          </div>
        </div>
      }
    >
      <GridContentInner {...props} />
    </ErrorBoundary>
  );
};
