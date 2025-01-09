import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/custom/CustomSheet'

interface FilterFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onClose: () => void
  children: React.ReactNode
}

export function FilterFormSheet({
  open,
  onOpenChange,
  title,
  description,
  onClose,
  children
}: FilterFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={"right"} className="w-[100dvw] sm:w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          {children}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

