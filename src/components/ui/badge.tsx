import type { ReactNode } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const badgeColorVariants = {
  neutral: "hover:bg-background",
  green:
    "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-800 border-green-200 dark:border-green-500",
  blue: "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800 border-blue-200 dark:border-blue-500",
  red: "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800 border-red-200 dark:border-red-500",
  orange:
    "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-800 border-orange-200 dark:border-orange-500",
  yellow:
    "text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-500",
  violet:
    "text-violet-600 bg-violet-100 dark:text-violet-300 dark:bg-violet-800 border-violet-200 dark:border-violet-500",
};

const badgeSizeVariants = {
  sm: "h-6 px-2 text-xs",
  md: "h-7 px-3 text-sm",
  lg: "h-8 px-4 text-base",
};

const badgeRoundedVariants = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const badgeIconPositionVariants = {
  start: "flex-row",
  end: "flex-row-reverse",
};

const badgesVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border transition-colors gap-2",
  {
    variants: {
      color: badgeColorVariants,
      size: badgeSizeVariants,
      rounded: badgeRoundedVariants,
      border: {
        true: "border",
        false: "border-transparent",
      },
      iconPosition: badgeIconPositionVariants,
    },
    defaultVariants: {
      color: "neutral",
      size: "md",
      rounded: "md",
      border: true,
      iconPosition: "start",
    },
  }
);

// Corregimos los conflictos excluyendo `color` de las propiedades de HTML
type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color">;

interface BadgeProps extends DivProps, VariantProps<typeof badgesVariants> {
  icon?: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  color,
  size,
  rounded,
  border,
  icon,
  iconPosition,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        badgesVariants({ color, size, rounded, border, iconPosition }),
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </div>
  );
};

export { type BadgeProps, Badge };
