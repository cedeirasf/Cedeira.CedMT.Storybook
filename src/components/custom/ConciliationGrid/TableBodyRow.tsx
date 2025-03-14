import type { Virtualizer, VirtualItem } from "@tanstack/react-virtual"
import { flexRender, type Row } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import React,{ useEffect, useState, useRef } from "react"
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
    const bracketMsMatch = delayStr.match(`duration-&lsqb;XXXms&rsqb;`)
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
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Usar un key para forzar el re-renderizado cuando cambia el updateStyle
  const updateStyleKey = updateStyle ? `${updateStyle.style.join("-")}-${updateStyle.delay}` : "none"

  useEffect(() => {
    // Limpiar cualquier temporizador existente
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (updateStyle && updateStyle.style.length > 0) {
      // Forzar un reflow antes de aplicar el estilo
      setShowUpdateStyle(false)

      // Pequeño retraso para asegurar que el estado anterior se haya aplicado
      setTimeout(() => {
        setShowUpdateStyle(true)

        const durationMs = extractDurationMs(updateStyle.delay)
        console.log(`Row ${rowIndex} update type: ${updateStyle.style.join(", ")} with duration: ${durationMs}ms`)

        // Configurar un temporizador para eliminar el estilo después de la duración
        timerRef.current = setTimeout(() => {
          setShowUpdateStyle(false)
          console.log(`Row ${rowIndex} animation completed after ${durationMs}ms`)
        }, durationMs + 200) // Añadir un pequeño margen
      }, 50)
    } else {
      setShowUpdateStyle(false)
    }

    // Limpieza al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [updateStyleKey, rowIndex, updateStyle])

  // Determinar las clases de estilo
  const updateClasses = showUpdateStyle && updateStyle ? [...updateStyle.style, updateStyle.delay] : []

  return (
    <tr
      data-index={virtualRow.index}
      data-update-type={updateStyle?.style.join("-") || "none"}
      ref={rowVirtualizer.measureElement}
      style={{
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start - rowIndex * virtualRow.size}px)`,
      }}
      className={cn(
        format && format.length > 0 ? format.join(" ") : "",
        "transition-colors hover:bg-gray-50 relative",
        ...updateClasses,
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

