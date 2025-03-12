import type { ConditionalRowFormat } from "@/types/components/custom-table-conciliation-type";
import { type Virtualizer } from "@tanstack/react-virtual";
import React, { useMemo } from "react";
import { adaptRowStyleDictionary } from "@/helpers/adapter/grid.adapter.helpers";
import { Table } from "@tanstack/react-table";
import { TableBodyRow } from "./TableBodyRow";

interface Props {
  table: Table<Record<string, unknown>>;
  conditionalRowFormat: ConditionalRowFormat[];
  isLoading: boolean;
  baseIndex: number;
  virtualizer: Virtualizer<HTMLTableElement, Element>;
}

export const TableBody = ({
  table,
  conditionalRowFormat,
  isLoading,
  baseIndex,
  virtualizer,
}: Props) => {
  const cellStyles = useMemo(
    () => adaptRowStyleDictionary(conditionalRowFormat),
    [conditionalRowFormat]
  );

  const { rows } = table.getRowModel();

  return (
    <tbody>
      {virtualizer.getVirtualItems().map((virtualRow, index) => {
        const row = rows[virtualRow.index];
        const rowIndex = virtualRow.index + baseIndex + 1;
        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={virtualizer}
            format={cellStyles[rowIndex]}
            rowIndex={index}
            isLoading={isLoading}
          />
        );
      })}
    </tbody>
  );
};
