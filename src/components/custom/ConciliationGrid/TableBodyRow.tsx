import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual"
import { flexRender, type Row } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import React,{ useEffect, useState } from "react"
import type { UpdatingRowStyle } from "@/types/components/custom-table-conciliation-type"

interface Props {
  row: Row<Record<string, unknown>>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLTableElement, Element>
  format: string[]
  rowIndex: number
  isLoading: boolean
  updateStyle?: UpdatingRowStyle
}

export const TableBodyRow = ({ row, virtualRow, rowVirtualizer, rowIndex, format, isLoading, updateStyle }: Props) => {
  const [showUpdateStyle, setShowUpdateStyle] = useState(false)

  useEffect(() => {
    if (updateStyle && updateStyle.style.length > 0) {
      setShowUpdateStyle(true)

      const timer = setTimeout(() => {
        setShowUpdateStyle(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [updateStyle])

  return (
    <tr
      data-index={virtualRow.index}
      ref={rowVirtualizer.measureElement}
      style={{
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start - rowIndex * virtualRow.size}px)`,
      }}
      className={cn(
        format && format.length > 0 ? format.join(" ") : "",
        "transition-all duration-700 hover:bg-gray-50 relative",
        updateStyle ? `${updateStyle.style.join(" ")} ${ updateStyle?.delay} anination-fade` : "",
      )}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            className={cn("px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-200")}
            key={cell.id}
          >
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </td>
        )
      })}
    </tr>
  )
}

