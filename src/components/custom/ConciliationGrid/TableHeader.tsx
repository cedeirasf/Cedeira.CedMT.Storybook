import React from "react";
import { cn } from "@/lib/utils";
import type { SchemeColumn } from "@/types/components/custom-table-conciliation-type";

interface TableHeaderProps {
  scheme: Record<string, SchemeColumn>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ scheme }) => {
  return (
    <thead className={cn("bg-gray-50 sticky top-0 z-20 shadow-sm")}>
      <tr>
        {Object.entries(scheme)
          .filter(([, column]) => column.behaviors.visible)
          .map(([key, column]) => (
            <th
              key={key}
              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {column.display}
            </th>
          ))}
      </tr>
    </thead>
  );
};
