import { type BadgeProps, Badge } from "@/components/ui/badge";
import type React from "react";
import { RotateCcw, X, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusOption {
  value: string | number;
  display: string;
  styles?: string[];
}

interface StatusBadgeProps {
  value: string | number;
  options?: StatusOption[];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  options = [],
  className,
}) => {
  const getStatusConfig = (
    display: string
  ): { icon: React.ElementType | null; color: BadgeProps["color"] } => {
    const displayLower = display.toLowerCase();

    // Estados específicos que requieren iconos
    if (displayLower.includes("pendiente")) {
      return { icon: RotateCcw, color: "yellow" };
    }
    if (displayLower.includes("ajust")) {
      return { icon: X, color: "red" };
    }
    if (displayLower.includes("exitoso") || displayLower.includes("concilia")) {
      return { icon: Check, color: "green" };
    }
    if (
      displayLower.includes("ignorada") ||
      displayLower.includes("no aplica")
    ) {
      return { icon: ArrowUpRight, color: "neutral" };
    }

    // Para otros casos, no usar icono
    return { icon: null, color: "neutral" };
  };

  const option = options.find((opt) => opt.value === value);
  if (!option) {
    return (
      <Badge color="neutral" className={className}>
        {String(value)}
      </Badge>
    );
  }

  const { icon: Icon, color } = getStatusConfig(option.display);

  // Si hay estilos específicos en las options, usarlos
  const hasCustomStyles = option.styles && option.styles.length > 0;

  return (
    <Badge
      color={hasCustomStyles ? undefined : color}
      className={cn(hasCustomStyles && option.styles, className)}
    >
      {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
      {option.display.toUpperCase()}
    </Badge>
  );
};
