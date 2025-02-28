import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        small: "h-8 text-xs",
        medium: "h-10",
        large: "h-12 text-lg",
      },
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        active: "border-primary ring-2 ring-primary",
      },
    },
    defaultVariants: {
      size: "medium",
      state: "default",
    },
  }
);

type InputVariantsProps = VariantProps<typeof inputVariants>;

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariantsProps {
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, type, label, helperText, id, ...props }, ref) => {
    const inputId = React.useId();
    const actualId = id || inputId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={actualId}
            className={cn(
              "text-sm font-medium text-foreground",
              state === "error" && "text-destructive",
              props.disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={actualId}
            className={cn(inputVariants({ size, state, className }))}
            ref={ref}
            aria-invalid={state === "error"}
            aria-describedby={
              helperText ? `${actualId}-description` : undefined
            }
            {...props}
          />
          {state === "error" && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-destructive"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {helperText && (
          <p
            id={`${actualId}-description`}
            className={cn(
              "text-sm text-muted-foreground",
              state === "error" && "text-destructive",
              props.disabled && "opacity-50"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { type InputVariantsProps, type InputProps, Input, inputVariants };
