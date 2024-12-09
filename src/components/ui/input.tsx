import * as React from "react";
import { cn } from "@/lib/utils";

// Tipos permitidos para el tamaño y estados
type InputSize = "small" | "medium" | "large";
type InputState = "default" | "error" | "active";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  inputState?: InputState;
  type?: "text" | "number" | "email" | "password" | "date" | "tel" | "url";
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "medium", inputState = "default", type = "text", disabled, ...props }, ref) => {
    // Clases dinámicas basadas en el tamaño y estado
    const sizeClasses = {
      small: "h-8 text-sm",
      medium: "h-10 text-base",
      large: "h-12 text-lg",
    };

    const stateClasses = {
      default:
        "border-input focus-visible:ring-ring dark:border-gray-700 dark:focus-visible:ring-gray-500",
      error:
        "border-red-500 focus-visible:ring-red-500 dark:border-red-700 dark:focus-visible:ring-red-400",
      active:
        "border-blue-500 focus-visible:ring-blue-500 dark:border-blue-700 dark:focus-visible:ring-blue-400",
      disabled:
        "cursor-not-allowed opacity-50 border-muted-foreground bg-muted-foreground",
    };

    return (
      <input
        type={type}
        aria-invalid={inputState === "error" ? true : undefined}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(
          "flex w-full rounded-md bg-background px-3 py-2 placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400",
          sizeClasses[inputSize],
          stateClasses[inputState],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);


Input.displayName = "Input";

export { Input };
