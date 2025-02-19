import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-primary
          dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 dark:hover:ring-primary
        `,
        destructive: `
          bg-destructive text-destructive-foreground hover:bg-red-600 hover:ring-red-600
          dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-red-700 dark:hover:ring-red-700
        `,
        outline: `
          border border-border text-foreground hover:bg-muted/10 hover:ring-border
          dark:border-muted dark:text-primary dark:hover:bg-muted/10 dark:hover:ring-muted
        `,
        secondary: `
          bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:ring-secondary
          dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-gray-700 dark:hover:ring-secondary
        `,
        ghost: `
          text-foreground hover:bg-muted/10 hover:ring-muted
          dark:text-foreground dark:hover:bg-muted/10 dark:hover:ring-muted
        `,
        link: `
          text-primary underline-offset-4 hover:underline hover:text-primary/70
          dark:text-primary dark:hover:text-blue-300
        `,
        elevated: `
          bg-secondary shadow-md text-foreground hover:shadow-lg hover:bg-secondary/80 hover:ring-secondary
          dark:bg-muted dark:shadow-lg dark:hover:bg-gray-800 dark:text-foreground dark:hover:ring-muted
        `,
        tonal: `
          bg-secondary-container text-secondary-foreground hover:bg-secondary-container/80 hover:ring-secondary-container
          dark:bg-secondary dark:text-on-secondary dark:hover:bg-gray-700 dark:hover:ring-secondary
        `,
      },
      size: {
        sm: "h-8 px-3 py-1.5",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "elevated"
    | "tonal";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, icon, iconPosition, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "start" && (
          <span className="mr-2 inline-flex items-center">{icon}</span>
        )}
        {props.children}
        {icon && iconPosition === "end" && (
          <span className="ml-2 inline-flex items-center">{icon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
