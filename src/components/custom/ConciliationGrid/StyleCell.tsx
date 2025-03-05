import type React from "react"
import { cn } from "@/lib/utils"
import Badge from "@/components/ui/badge"

interface StyleCellProps {
  value: string | number
  options?: { value: string | number; display: string; styles?: string[] }[]
  className?: string
}

export const StyleCell: React.FC<StyleCellProps> = ({ value, options, className }) => {
  if (!options) {
    return <span className={className}>{value}</span>
  }

  const option = options.find((opt) => opt.value === value.toString())

  if (!option) {
    return <span className={className}>{value}</span>
  }

  const hasBgClass = option.styles?.some((style) => style.includes("bg-"))

  if (hasBgClass) {
    return (
      <Badge className={cn(option.styles, className, option.styles?.length === 0 ? "bg-slate-500" : "")}>
        {option.display}
      </Badge>
    )
  }

  return <span className={cn(option.styles, className)}>{option.display}</span>
}

