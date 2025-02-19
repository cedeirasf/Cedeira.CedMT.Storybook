import type { ICustomDialog } from "@/types/components/custom-dialog.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";
import React from "react";

export const CustomDialog: React.FC<ICustomDialog> = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  footer,
  contentClassName,
  closeOnClickOutside = true,
  backdropOpacity = 0.2,
  size = "md",
  disableEscapeKeyDown = false,
  ...props
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const backdropStyle = {
    backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={clsx(
          "fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[80vh] overflow-y-auto",
          sizeClasses[size as keyof typeof sizeClasses],
          contentClassName
        )}
        onInteractOutside={(e) => {
          if (!closeOnClickOutside) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (disableEscapeKeyDown) e.preventDefault();
        }}
        {...props}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-40"
          style={backdropStyle}
        />
      )}
    </Dialog>
  );
};
