import type { ConditionalRowFormat, UpdatingRows } from "@/types/components/custom-table-conciliation-type"
import type { Virtualizer } from "@tanstack/react-virtual"
import React, { useMemo } from "react"
import { adaptRowStyleDictionary } from "@/helpers/adapter/grid.adapter.helpers"
import type { Table } from "@tanstack/react-table"
import { TableBodyRow } from "./TableBodyRow"

interface Props {
  table: Table<Record<string, unknown>>
  conditionalRowFormat: ConditionalRowFormat[]
  isLoading: boolean
  baseIndex: number
  virtualizer: Virtualizer<HTMLTableElement, Element>
  updatingRows?: UpdatingRows
}

export const TableBody = ({ table, conditionalRowFormat, isLoading, baseIndex, virtualizer, updatingRows }: Props) => {
  const cellStyles = useMemo(() => adaptRowStyleDictionary(conditionalRowFormat), [conditionalRowFormat])

  const { rows } = table.getRowModel()

  return (
    <tbody>
      {virtualizer.getVirtualItems().map((virtualRow, index) => {
        const row = rows[virtualRow.index]
        if (!row) return null

        const rowIndex = virtualRow.index + baseIndex + 1

        // Obtener el estilo de actualización para esta fila si existe
        const updateStyle =
          updatingRows &&
          updatingRows.rows[virtualRow.index] &&
          updatingRows.scheme[updatingRows.rows[virtualRow.index].type]

        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={virtualizer}
            format={cellStyles[rowIndex]}
            rowIndex={index}
            isLoading={isLoading}
            updateStyle={updateStyle}
          />
        )
      })}
    </tbody>
  )
}

