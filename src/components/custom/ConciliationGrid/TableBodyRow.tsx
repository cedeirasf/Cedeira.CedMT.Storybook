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

const extractDurationMs = (delayStr?: string): number => {
  if (!delayStr) return 2000 // default duration

  try {
    // Manejar duration-[XXXms]
    const bracketMsMatch = delayStr.match(/duration-\[(\d+)ms\]/)
    if (bracketMsMatch && bracketMsMatch[1]) {
      return Number.parseInt(bracketMsMatch[1], 10)
    }

    // Manejar duration-XXX (sin unidades)
    const standardMatch = delayStr.match(/duration-(\d+)/)
    if (standardMatch && standardMatch[1]) {
      return Number.parseInt(standardMatch[1], 10)
    }

    return 2000 // default duration si no hay match
  } catch (error) {
    console.error("Error parsing duration:", error)
    return 2000 // default duration en caso de error
  }
}

export const TableBodyRow = ({ row, virtualRow, rowVirtualizer, rowIndex, format, isLoading, updateStyle }: Props) => {
  const [showUpdateStyle, setShowUpdateStyle] = useState(false)

  useEffect(() => {
    if (updateStyle && updateStyle.style.length > 0) {
      setShowUpdateStyle(true)

      const durationMs = extractDurationMs(updateStyle.delay)
      console.log("Duration for update:", durationMs, "ms") // Para debugging

      const timer = setTimeout(() => {
        setShowUpdateStyle(false)
      }, durationMs)

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
        "transition-all hover:bg-gray-50 relative",
        showUpdateStyle && updateStyle ? [...updateStyle.style, updateStyle.delay, "animation-fade"] : "",
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

