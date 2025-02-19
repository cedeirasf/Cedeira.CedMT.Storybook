import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200",
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
};

export interface CustomTooltipProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  children?: React.ReactNode;
  open?: boolean;
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  variant?: "success" | "error" | "warning" | "info";
}

export const CustomTooltip = ({
  children,
  trigger,
  variant = "info",
  onOpenChange,
  align,
  side,
  defaultOpen,
  delayDuration,
  disableHoverableContent,
  open,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        {trigger && <TooltipTrigger>{trigger}</TooltipTrigger>}
        <TooltipContent
          side={side}
          align={align}
          className={cn(variantStyles[variant as keyof typeof variantStyles])}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
