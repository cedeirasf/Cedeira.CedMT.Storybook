import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, Trash2 } from 'lucide-react'
import * as React from "react"
import TagFilter from "./CustomTagFilter"


const multiselectVariants = cva(
  "relative flex w-full rounded-md border bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-none",
  {
    variants: {
      size: {
        small: "h-8 text-xs",
        medium: "min-h-10",
        large: "min-h-12 text-lg",
      },
      state: {
        default: "border-input-dark dark:border-input",
        error: "border-destructive focus-within:ring-destructive",
        active: "border-primary ring-2 ring-primary",
      },
    },
    defaultVariants: {
      size: "medium",
      state: "default",
    },
  }
)

export type Option = {
  value: string
  label: string
}

interface CustomMultiselectProps extends VariantProps<typeof multiselectVariants> {
  options?: Option[]
  selected?: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  label?: string
  maxCount?: number
  className?: string
  helperText?: string
}

export function CustomMultiselect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  label,
  maxCount = 3,
  className,
  size,
  state,
  helperText,
}: CustomMultiselectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [internalState, setInternalState] = React.useState(state)

  const safeOptions = React.useMemo(() => options ?? [], [options])
  const safeSelected = React.useMemo(() => selected ?? [], [selected])

  const filteredOptions = React.useMemo(() =>
    safeOptions.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    ),
    [safeOptions, searchValue]
  )

  const handleSelect = React.useCallback((currentValue: string) => {
    const newSelected = safeSelected.includes(currentValue)
      ? safeSelected.filter((item) => item !== currentValue)
      : [...safeSelected, currentValue]
    onChange(newSelected)
  }, [safeSelected, onChange])

  const handleSelectAll = React.useCallback(() => {
    const allValues = safeOptions.map((option) => option.value)
    onChange(allValues)
  }, [safeOptions, onChange])

  const handleClear = React.useCallback(() => {
    onChange([])
    setOpen(false)
  }, [onChange])

  const visibleTags = React.useMemo(() =>
    safeSelected.slice(0, maxCount),
    [safeSelected, maxCount]
  )

  const hiddenTagsCount = React.useMemo(() =>
    Math.max(0, safeSelected.length - maxCount),
    [safeSelected.length, maxCount]
  )

  const inputId = React.useId()

  React.useEffect(() => {
    if (state === 'error' && safeSelected.length > 0) {
      setInternalState('default')
    } else {
      setInternalState(state)
    }
  }, [state, safeSelected])

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-foreground",
            internalState === "error" && "text-destructive"
          )}
        >
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={cn(multiselectVariants({ size, state: internalState }), className)}>
            <div className="flex flex-wrap items-center gap-1 p-2 pe-8">
              {safeSelected.length > 0 ? (
                <>
                  {visibleTags.map((value) => {
                    const option = safeOptions.find((opt) => opt.value === value)
                    return (
                      <TagFilter
                        key={value}
                        label={option?.label || value}
                        onRemove={() => handleSelect(value)}
                        size="sm"
                        color="blue"
                        rounded="full"
                        truncate
                      />
                    )
                  })}
                  {hiddenTagsCount > 0 && (
                    <TagFilter
                      label={`+${hiddenTagsCount} more`}
                      size="sm"
                      color="neutral"
                      rounded="full"
                    />
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="absolute right-2 top-2.5">
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false} className="border-none">
            <div className="flex items-center border-b px-3">
              {/*<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />*/}
              <CommandInput
                placeholder="Search options..."
                value={searchValue}
                onValueChange={setSearchValue}
                className="h-9 px-3"
              />
            </div>
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  <CommandItem
                    onSelect={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded border border-primary dark:border-primary">
                      <Check
                        className={cn(
                          "h-3 w-3 text-primary dark:text-primary-foreground transition-opacity",
                          safeOptions.length === safeSelected.length ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <span className="font-medium text-foreground dark:text-primary-foreground">Select All</span>
                  </CommandItem>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded border border-primary dark:border-primary">
                        <Check
                          className={cn(
                            "h-3 w-3 text-primary dark:text-primary-foreground transition-opacity",
                            safeSelected.includes(option.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-between border-t p-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClear}
                className="flex items-center"
                type="button"
              >
                <Trash2 className=" h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cerrar
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      {helperText && (
        <p
          className={cn(
            "text-sm text-muted-foreground",
            internalState === "error" && "text-destructive"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

