import type React from "react"

import { cn } from "@/lib/utils"
import { SchemeColumn } from "@/types/components/custom-table-conciliation-type"

interface EmptyRowsProps {
  count: number
  scheme: { [key: string]: SchemeColumn }
}

export const EmptyRows: React.FC<EmptyRowsProps> = ({ count, scheme }) => (
  <>
    {Array(count)
      .fill(null)
      .map((_, idx) => (
        <tr key={`empty-${idx}`} className="h-[52px]">
          {Object.entries(scheme).map(
            ([key, column]) =>
              column.behaviors.visible && (
                <td
                  key={key}
                  className={cn(
                    "h-[52px]",
                    "border border-gray-200",
                    "align-middle",
                    "first:w-[200px]",
                    "w-[150px]",
                    "px-4",
                  )}
                />
              ),
          )}
        </tr>
      ))}
  </>
)

