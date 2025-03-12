import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Sheet as BaseSheet,
  SheetContent as BaseSheetContent,
  SheetDescription as BaseSheetDescription,
  SheetHeader as BaseSheetHeader,
  SheetTitle as BaseSheetTitle,
  SheetTrigger as BaseSheetTrigger,
  SheetClose as BaseSheetClose,
  SheetFooter as BaseSheetFooter,
  SheetPortal,
  SheetOverlay,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const sheetVariants = cva("flex flex-col gap-4", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom:
        "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
      right:
        "inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    },
    size: {
      small: "",
      medium: "",
      large: "",
    },
  },
  compoundVariants: [
    {
      side: ["top", "bottom"],
      size: "small",
      className: "h-1/4",
    },
    {
      side: ["top", "bottom"],
      size: "medium",
      className: "h-1/3",
    },
    {
      side: ["top", "bottom"],
      size: "large",
      className: "h-1/2",
    },
    {
      side: ["left", "right"],
      size: "small",
      className: "w-1/4 sm:max-w-sm",
    },
    {
      side: ["left", "right"],
      size: "medium",
      className: "w-1/3 sm:max-w-md",
    },
    {
      side: ["left", "right"],
      size: "large",
      className: "w-1/2 sm:max-w-lg",
    },
  ],
  defaultVariants: {
    side: "right",
    size: "medium",
  },
});

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseSheetContent>,
    VariantProps<typeof sheetVariants> {
  showBackdrop?: boolean;
  backdropClassName?: string;
}

const Sheet = BaseSheet;
const SheetTrigger = BaseSheetTrigger;
const SheetClose = BaseSheetClose;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof BaseSheetContent>,
  SheetContentProps
>(
  (
    {
      side = "right",
      size = "medium",
      className,
      children,
      showBackdrop = true,
      backdropClassName,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      {showBackdrop ? (
        <SheetOverlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            backdropClassName
          )}
        />
      ) : null}
      <BaseSheetContent
        ref={ref}
        side={side}
        className={cn(
          sheetVariants({ side, size }),
          "flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </BaseSheetContent>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetHeader>) => (
  <BaseSheetHeader className={cn("flex-none", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetFooter>) => (
  <BaseSheetFooter className={cn("mt-auto flex-none", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = BaseSheetTitle;
const SheetDescription = BaseSheetDescription;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
