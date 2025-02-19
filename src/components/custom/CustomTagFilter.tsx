import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border transition-colors gap-2",
  {
    variants: {
      color: {
        neutral:
          "text-gray-800 bg-gray-100 border-gray-300 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 ",
        green:
          "text-green-600 bg-green-100 border-green-200 hover:bg-green-200 dark:text-green-300 dark:bg-green-800 dark:border-green-700 dark:hover:bg-green-700",
        blue: "text-blue-600 bg-blue-100 border-blue-200 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-800 dark:border-blue-700 dark:hover:bg-blue-700",
        red: "text-red-600 bg-red-100 border-red-200 hover:bg-red-200 dark:text-red-300 dark:bg-red-800 dark:border-red-700 dark:hover:bg-red-700",
        orange:
          "text-orange-600 bg-orange-100 border-orange-200 hover:bg-orange-200 dark:text-orange-300 dark:bg-orange-800 dark:border-orange-700 dark:hover:bg-orange-700",
        yellow:
          "text-yellow-700 bg-yellow-100 border-yellow-200 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-800 dark:border-yellow-700 dark:hover:bg-yellow-700",
        violet:
          "text-violet-600 bg-violet-100 border-violet-200 hover:bg-violet-200 dark:text-violet-300 dark:bg-violet-800 dark:border-violet-700 dark:hover:bg-violet-700",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7 px-3 text-sm",
        lg: "h-8 px-4 text-base",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      border: {
        true: "border",
        false: "border-transparent",
      },
    },
    defaultVariants: {
      color: "neutral",
      size: "md",
      rounded: "md",
      border: true,
    },
  }
);

interface TagFilterProps extends VariantProps<typeof badgeVariants> {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  truncate?: boolean;
}

const TagFilter: React.FC<TagFilterProps> = ({
  label,
  onClick,
  onRemove,
  className,
  disabled = false,
  truncate = true,
  color,
  size,
  rounded,
  border,
}) => {
  return (
    <div
      className={cn(
        badgeVariants({ color, size, rounded, border }),
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Lado izquierdo: Acción principal */}
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        variant="ghost"
        className={cn(
          "p-0 bg-transparent border-0 shadow-none",
          "hover:underline hover:bg-transparent focus:outline-none transition-colors",
          "h-full flex items-center justify-start text-inherit dark:text-inherit", // Asegura que el texto herede el color correcto en dark/light
          truncate && "truncate max-w-[150px]"
        )}
      >
        <span className="truncate">{label}</span>
      </Button>

      {/* Botón de eliminar */}
      {onRemove && (
        <Button
          onClick={onRemove}
          disabled={disabled}
          variant="ghost"
          size="icon"
          className={cn(
            "ml-1 h-4 w-4 rounded-full text-inherit",
            "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-0 transition-colors"
          )}
          aria-label="Remove filter"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default TagFilter;
