import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  MultiSelectContextProps,
  MultiSelectorProps,
  TagFilterStyleProps,
} from "@/types/components/custom-multiselect.type";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";
import TagFilter from "./CustomTagFilter";

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector: React.FC<MultiSelectorProps> = ({
  values: value,
  onValuesChange: onValueChange,
  options,
  maxCount,
  placeholder,
  className,
  tagStyles,
  children,
  ...props
}: MultiSelectorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const selectAll = useCallback(() => {
    onValueChange(options.map((option) => option.value));
  }, [options, onValueChange]);

  const deselectAll = useCallback(() => {
    onValueChange([]);
  }, [onValueChange]);

  const onValueChangeHandler = useCallback(
    (val: string) => {
      const newValues = value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val];
      onValueChange(newValues);
    },
    [value, onValueChange]
  );

  const isAllSelected = value.length === options.length;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        options,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        search,
        setSearch,
        selectAll,
        deselectAll,
        isAllSelected,
        maxCount,
        placeholder,
        tagStyles,
      }}
    >
      <div className="relative w-full" onKeyDown={handleKeyDown} {...props}>
        <Command className={cn("w-full", className)}>{children}</Command>
      </div>
    </MultiSelectContext.Provider>
  );
};

// Omitir 'color' de HTMLAttributes para evitar el conflicto
type MultiSelectorTriggerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> &
  TagFilterStyleProps;

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  MultiSelectorTriggerProps
>(({ className, color, size, rounded, ...props }, ref) => {
  const {
    value,
    options,
    onValueChange,
    open,
    setOpen,
    maxCount,
    placeholder,
    tagStyles,
  } = useMultiSelect();

  const displayedTags =
    maxCount && value.length > maxCount ? value.slice(0, maxCount) : value;

  // Combine passed props with context tagStyles, with props taking precedence
  const finalTagStyles: TagFilterStyleProps = {
    ...tagStyles,
    color: color || tagStyles?.color || "blue",
    size: size || tagStyles?.size || "sm",
    rounded: rounded || tagStyles?.rounded || "full",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative cursor-pointer rounded-md border border-input bg-transparent px-3  text-start py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <div className="flex items-center min-h-[20px]">
        <div className="flex flex-wrap gap-1 items-center flex-1">
          {displayedTags.map((item) => (
            <TagFilter
              key={item}
              label={options.find((opt) => opt.value === item)?.label || item}
              onRemove={() => onValueChange(item)}
              {...finalTagStyles}
            />
          ))}
          {maxCount && value.length > maxCount && (
            <TagFilter
              label={`+${value.length - maxCount}`}
              {...finalTagStyles}
              color="neutral"
            />
          )}
          {!value.length && placeholder && (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center ml-2">
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </div>
    </div>
  );
});

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useMultiSelect();

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-full z-50 min-w-[200px] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-2",
        className
      )}
      {...props}
    />
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, ref) => {
  const { search, setSearch } = useMultiSelect();

  return (
    <CommandInput
      ref={ref}
      value={search}
      onValueChange={setSearch}
      className={cn("border-none focus:ring-0", className)}
      {...props}
    />
  );
});

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorList = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandList>
>(({ className, ...props }, ref) => {
  const {
    options,
    value,
    onValueChange,
    search,
    isAllSelected,
    selectAll,
    deselectAll,
  } = useMultiSelect();

  return (
    <CommandList
      ref={ref}
      className={cn(
        "max-h-[200px] overflow-y-auto overscroll-contain",
        "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500",
        className
      )}
      {...props}
    >
      <CommandEmpty>No hay resultados.</CommandEmpty>
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            if (isAllSelected) {
              deselectAll();
            } else {
              selectAll();
            }
          }}
        >
          <div className="flex items-center">
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
              {isAllSelected ? <Check className="h-4 w-4" /> : null}
            </div>
            Seleccionar Todo
          </div>
        </CommandItem>
        {options
          .filter(
            (option) =>
              option.label.toLowerCase().includes(search.toLowerCase()) ||
              option.value.toLowerCase().includes(search.toLowerCase())
          )
          .map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => onValueChange(option.value)}
            >
              <div className="flex items-center">
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                  {value.includes(option.value) ? (
                    <Check className="h-4 w-4" />
                  ) : null}
                </div>
                {option.label}
              </div>
            </CommandItem>
          ))}
      </CommandGroup>
    </CommandList>
  );
});

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setOpen, deselectAll } = useMultiSelect();

  return (
    <div
      ref={ref}
      className={cn("border-t p-2 flex gap-2", className)}
      {...props}
    >
      <Button
        onClick={() => setOpen(false)}
        variant="secondary"
        className="flex-1"
      >
        Cerrar
      </Button>
      <Button
        onClick={() => {
          deselectAll();
          setOpen(false);
        }}
        variant="destructive"
        size="icon"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

MultiSelectorFooter.displayName = "MultiSelectorFooter";

export {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorFooter,
  MultiSelectorInput,
  MultiSelectorList,
  MultiSelectorTrigger,
};
