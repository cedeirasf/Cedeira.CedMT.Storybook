import { ToastViewport } from "@radix-ui/react-toast";
import * as React from "react";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
} from "../ui/toast";

// Mapa de estilos para las variantes
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

export interface CustomToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode; // Permitir acciones personalizadas
  icon?: React.ReactNode; // Permitir íconos personalizados
  toastDuration?: "short" | "long" | "sticky";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  variant?: "success" | "error" | "warning" | "info";
}

export const CustomToast: React.FC = () => {
  const { toasts } = useToast();

  // Agrupa los toasts por posición
  const groupedToasts = React.useMemo(() => {
    return (toasts || []).reduce((groups, toast) => {
      const position = toast.position || "bottom-right";
      if (!groups[position]) groups[position] = [];
      groups[position].push(toast);
      return groups;
    }, {} as Record<string, typeof toasts>);
  }, [toasts]);

  if (!toasts || toasts.length === 0) return null; // Manejo de estado vacío

  return (
    <ToastProvider>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <ToastViewport
          key={position}
          className={cn(
            "fixed z-[100] flex flex-col gap-2 p-4 max-w-[420px]",
            position === "top-left" && "top-0 left-0",
            position === "top-right" && "top-0 right-0",
            position === "bottom-left" && "bottom-0 left-0",
            position === "bottom-right" && "bottom-0 right-0"
          )}
        >
          {positionToasts.map(
            ({
              id,
              variant = "info",
              icon,
              toastDuration = "short",
              title,
              description,
              action,
            }) => {
              const duration =
                toastDuration === "short"
                  ? 3000
                  : toastDuration === "long"
                  ? 7000
                  : Infinity;

              return (
                <Toast
                  key={id}
                  className={cn(
                    "group pointer-events-auto relative flex items-center space-x-4 rounded-md border p-4 pr-8 shadow-lg transition-all",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=open]:fade-in data-[state=closed]:fade-out",
                    "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
                    variantStyles[variant as keyof typeof variantStyles]
                  )}
                  duration={duration}
                >
                  {icon && <div className="h-5 w-5">{icon}</div>}
                  <div className="flex-1">
                    {title && (
                      <ToastTitle className="text-sm font-semibold">
                        {title}
                      </ToastTitle>
                    )}
                    {description && (
                      <ToastDescription className="text-sm opacity-90">
                        {description}
                      </ToastDescription>
                    )}
                  </div>
                  {action}
                  <ToastClose />
                </Toast>
              );
            }
          )}
        </ToastViewport>
      ))}
    </ToastProvider>
  );
};
