import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import React from "react";
import {
    Toast as BaseToast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "../../components/ui/toast";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";

interface CustomToastProps {
    variant?: "success" | "error" | "warning" | "info";
    position?: keyof typeof positionClassMap; // Nueva propiedad
    toastDuration?: "short" | "long" | "sticky";
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
}

const variantStyles = {
    success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
    error:
        "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
    warning:
        "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
    info:
        "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
};

const iconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const positionClassMap = {
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
};

export const CustomToast: React.FC<CustomToastProps> = ({
    variant = "info",
    toastDuration = "short",
    title,
    description,
    action,
}) => {
    const Icon = iconMap[variant];
    const duration =
        toastDuration === "short"
            ? 3000
            : toastDuration === "long"
                ? 7000
                : undefined;

    return (
        <BaseToast
            className={cn(
                "flex items-center space-x-4 p-4 rounded-md shadow-lg",
                variantStyles[variant]
            )}
            duration={duration}
        >
            <Icon className="h-6 w-6" />
            <div className="flex-1">
                {title && (
                    <ToastTitle className="font-semibold text-sm">{title}</ToastTitle>
                )}
                {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action && <ToastAction altText="Close">{action}</ToastAction>}
            <ToastClose />
        </BaseToast>
    );
};

export const CustomToastProvider: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    const { toasts } = useToast();
  
    const groupedToasts = toasts.reduce((groups, toast) => {
      const position = (toast as { position?: string }).position || "bottom-right";
      if (!groups[position]) groups[position] = [];
      groups[position].push(toast);
      return groups;
    }, {} as Record<string, typeof toasts>);

    return (
      <ToastProvider>
        {children}
        {Object.entries(groupedToasts).map(([position, toasts]) => {
          const positionClass = positionClassMap[position as keyof typeof positionClassMap];
          return (
            <ToastViewport
              key={position}
              className={cn(
                `fixed flex flex-col gap-2 p-4 max-w-[420px] z-50`,
                positionClass
              )}
            >
              {toasts.map(({ id, variant = "info", ...toastProps }) => (
                <CustomToast
                  key={id}
                  variant={variant as "success" | "error" | "warning" | "info"}
                  {...toastProps}
                />
              ))}
            </ToastViewport>
          );
        })}
      </ToastProvider>
    );
  };
  
