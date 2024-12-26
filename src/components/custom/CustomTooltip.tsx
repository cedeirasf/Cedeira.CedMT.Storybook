import * as React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { Content } from '@radix-ui/react-tooltip'
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200",
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
};

export interface CustomTooltipProps extends React.ComponentPropsWithoutRef<typeof Content> {
  children?: React.ReactNode; 
  trigger?: React.ReactNode;
  avoidCollisions?: boolean;
  variant?: "success" | "error" | "warning" | "info";
}

export const CustomTooltip: React.FC = ({
  children,
  avoidCollisions = true,
  trigger,
  variant,
  ...props
}: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        {trigger && <TooltipTrigger>{trigger}</TooltipTrigger>}
        <TooltipContent
          {...props}
          avoidCollisions={avoidCollisions}
          className={cn(
            variantStyles[variant as keyof typeof variantStyles]
          )}
        >
          {children}
        </TooltipContent>
      </Tooltip> 
    </TooltipProvider>
  );
};
