import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual";
import { flexRender, type Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface Props {
  row: Row<Record<string, unknown>>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLTableElement, Element>;
  format: string[];
  rowIndex: number;
  isLoading: boolean;
}
export const TableBodyRow = ({
  row,
  virtualRow,
  rowVirtualizer,
  rowIndex,
  format,
  isLoading,
}: Props) => {
  return (
    <tr
      data-index={virtualRow.index}
      ref={rowVirtualizer.measureElement}
      style={{
        height: `${virtualRow.size}px`,
        transform: `translateY(${
          virtualRow.start - rowIndex * virtualRow.size
        }px)`,
      }}
      className={cn(
        format && format.length > 0 ? format.join(" ") : "",
        "transition-all duration-700 hover:bg-gray-50 relative"
      )}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            className={cn(
              "px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-200"
            )}
            key={cell.id}
          >
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </td>
        );
      })}
    </tr>
  );
};
