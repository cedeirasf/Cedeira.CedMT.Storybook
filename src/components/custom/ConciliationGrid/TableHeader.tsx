import { type HeaderGroup, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import React from "react";

interface TableHeaderProps {
  headerGroups: HeaderGroup<Record<string, unknown>>[];
}
export const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups }) => {
  return (
    <thead className={cn("sticky top-0 z-20 shadow-sm")}>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{ width: header.getSize() }}
                className="px-4 py-2 text-left text-xs font-medium bg-card text-muted-foreground uppercase tracking-wider border whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};
