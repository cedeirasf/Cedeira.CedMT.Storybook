import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  ChannelViewFilterSchemeResponse,
  Filter,
  FilterScheme,
} from "@/types/components/custom-advanced-input-filter.type";
import { addDays, format } from "date-fns";
import { Loader2, Search } from "lucide-react";
import * as React from "react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

interface Suggestion {
  source: string;
  sourceDisplay: string;
  field: string;
  fieldDisplay: string;
  operator: string;
  operatorDisplay: string;
  tip: string;
  dataType: string;
  defaultValue: string;
}

interface InputDebounceProps {
  onSearch: (query: string) => void;
  onSelect: (filter: Partial<Filter>) => void;
  placeholder?: string;
  className?: string;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  value?: string;
  selectedFilters?: Filter[];
}

interface DefaultValues {
  TIME_DEFAULT: string;
  DATE_FORMAT: string;
  EMPTY_VALUE: string;
}

const DEFAULT_VALUES: DefaultValues = {
  TIME_DEFAULT: "00:00:00",
  DATE_FORMAT: "dd-MM-yyyy",
  EMPTY_VALUE: "",
} as const;

const getBaseTip = (tipText: string, operatorDisplay: string) => {
  const index = tipText.toLowerCase().indexOf(operatorDisplay.toLowerCase());
  return index !== -1 ? tipText.slice(0, index).trim() : tipText.trim();
};

function InputDebounce({
  onSearch,
  onSelect,
  placeholder = "Buscar...",
  className,
  filterScheme,
  sources,
  size = "medium",
  isLoading: externalLoading = false,
  value: externalValue = DEFAULT_VALUES.EMPTY_VALUE,
  selectedFilters = [],
}: InputDebounceProps) {
  const [query, setQuery] = useState(externalValue);
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const isFilterDuplicate = useCallback(
    (newFilter: Partial<Filter>): boolean => {
      return selectedFilters.some((existingFilter) => {
        if (
          !newFilter.source ||
          !newFilter.field ||
          !newFilter.operator ||
          !newFilter.value
        ) {
          return false;
        }

        if (
          existingFilter.source === "*" &&
          existingFilter.field === "*" &&
          newFilter.source === "*" &&
          newFilter.field === "*"
        ) {
          return (
            existingFilter.value.toString().toLowerCase() ===
            newFilter.value.toString().toLowerCase()
          );
        }

        const areValuesEqual =
          typeof existingFilter.value === "string" &&
          typeof newFilter.value === "string"
            ? existingFilter.value.toLowerCase() ===
              newFilter.value.toLowerCase()
            : existingFilter.value === newFilter.value;

        return (
          existingFilter.source === newFilter.source &&
          existingFilter.field === newFilter.field &&
          existingFilter.operator === newFilter.operator &&
          areValuesEqual
        );
      });
    },
    [selectedFilters]
  );

  const suggestions = useMemo(() => {
    if (!deferredQuery) return [] as Suggestion[];

    const validSuggestions: Suggestion[] = [];

    sources.forEach((source) => {
      Object.entries(source.fields ?? {}).forEach(([fieldKey, field]) => {
        (field.filteringTips ?? []).forEach((tip) => {
          if (!tip.tip?.toLowerCase().includes(deferredQuery.toLowerCase()))
            return;

          const dataType = filterScheme.data_types[field.data_type];
          const operator =
            dataType?.filtering_operators[tip.filtering_operator];

          if (!operator) return;

          if (operator?.range) {
            let defaultFrom = DEFAULT_VALUES.EMPTY_VALUE;
            let defaultTo = DEFAULT_VALUES.EMPTY_VALUE;

            if (dataType.scope === "time") {
              defaultFrom = DEFAULT_VALUES.TIME_DEFAULT;
              defaultTo = DEFAULT_VALUES.TIME_DEFAULT;
            } else if (dataType.scope === "date") {
              defaultFrom = format(new Date(), DEFAULT_VALUES.DATE_FORMAT);
              defaultTo = format(
                addDays(new Date(), 1),
                DEFAULT_VALUES.DATE_FORMAT
              );
            }

            const baseTip = getBaseTip(tip.tip, operator.display);

            validSuggestions.push({
              source: source.source,
              sourceDisplay: source.display,
              field: fieldKey,
              fieldDisplay: field.display,
              operator: tip.filtering_operator,
              operatorDisplay: operator.display,
              tip: baseTip,
              dataType: field.data_type,
              defaultValue: JSON.stringify({
                from: defaultFrom,
                to: defaultTo,
              }),
            });
          } else {
            let defaultValue = DEFAULT_VALUES.EMPTY_VALUE;
            if (dataType?.options) {
              const tipLower = tip.tip.toLowerCase();
              Object.entries(dataType.options).some(([key, value]) => {
                if (tipLower.includes(value.toLowerCase())) {
                  defaultValue = key;
                  return true;
                }
                return false;
              });
            }

            const baseTip = getBaseTip(tip.tip, operator.display);

            validSuggestions.push({
              source: source.source,
              sourceDisplay: source.display,
              field: fieldKey,
              fieldDisplay: field.display,
              operator: tip.filtering_operator,
              operatorDisplay: operator.display,
              tip: baseTip,
              dataType: field.data_type,
              defaultValue: defaultValue,
            });
          }
        });
      });
    });

    return validSuggestions;
  }, [deferredQuery, sources, filterScheme]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    if (selectedItemRef.current && suggestionsRef.current) {
      const container = suggestionsRef.current;
      const item = selectedItemRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += itemRect.bottom - containerRect.bottom;
      } else if (itemRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - itemRect.top;
      }
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setQuery(newValue);
      setShowSuggestions(true);

      startTransition(() => {
        onSearch(newValue);
      });
    },
    [onSearch]
  );

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      const filter: Partial<Filter> = {
        source: suggestion.source,
        field: suggestion.field,
        operator: suggestion.operator,
        value: suggestion.defaultValue || DEFAULT_VALUES.EMPTY_VALUE,
      };

      if (suggestion.operator.includes("between")) {
        try {
          const { from, to } = JSON.parse(suggestion.defaultValue);
          if (
            from === DEFAULT_VALUES.EMPTY_VALUE ||
            to === DEFAULT_VALUES.EMPTY_VALUE ||
            from === DEFAULT_VALUES.TIME_DEFAULT ||
            to === DEFAULT_VALUES.TIME_DEFAULT
          ) {
            // Si los valores están vacíos o son los valores por defecto, abrimos el Sheet
            onSelect({
              ...filter,
              value: undefined, // Esto indicará que se debe abrir el Sheet
            });
          } else {
            // Si ya tiene valores, seleccionamos el filtro directamente
            onSelect(filter);
          }
        } catch {
          // Si hay un error al parsear, tratamos como si los valores estuvieran vacíos
          onSelect({
            ...filter,
            value: undefined,
          });
        }
      } else {
        // Para filtros que no son de rango
        if (filter.value === DEFAULT_VALUES.EMPTY_VALUE) {
          // Si no tiene valor, abrimos el Sheet
          onSelect({
            ...filter,
            value: undefined,
          });
        } else {
          // Si ya tiene un valor, seleccionamos el filtro directamente
          onSelect(filter);
        }
      }

      setQuery(DEFAULT_VALUES.EMPTY_VALUE);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelect(suggestions[selectedIndex]);
          } else if (query.trim()) {
            const genericFilter = {
              source: "*",
              field: "*",
              operator: "contains",
              value: query.trim() || DEFAULT_VALUES.EMPTY_VALUE,
            };
            if (!isFilterDuplicate(genericFilter)) {
              onSelect(genericFilter);
              setQuery(DEFAULT_VALUES.EMPTY_VALUE);
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [
      showSuggestions,
      suggestions,
      selectedIndex,
      query,
      handleSelect,
      onSelect,
      isFilterDuplicate,
    ]
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".suggestions-container")) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderSuggestionContent = (suggestion: Suggestion) => {
    const { tip, operatorDisplay, defaultValue, operator } = suggestion;
    const baseText = `${tip} ${operatorDisplay.toLowerCase()}`;

    if (operator.includes("between")) {
      try {
        const { from, to } = JSON.parse(defaultValue);
        if (
          from !== DEFAULT_VALUES.EMPTY_VALUE &&
          to !== DEFAULT_VALUES.EMPTY_VALUE &&
          from !== DEFAULT_VALUES.TIME_DEFAULT &&
          to !== DEFAULT_VALUES.TIME_DEFAULT
        ) {
          return `${baseText} ${from} - ${to}`;
        }
      } catch {
        // Si hay un error al parsear, solo devolvemos el texto base
      }
    } else if (defaultValue && defaultValue !== DEFAULT_VALUES.EMPTY_VALUE) {
      return `${baseText} ${defaultValue}`;
    }

    return baseText;
  };

  return (
    <div className="relative suggestions-container">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        {externalLoading || isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <Input
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className={cn("pl-10", className)}
        placeholder={placeholder}
        size={size}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div
            ref={suggestionsRef}
            className="max-h-[300px] overflow-auto p-1 space-y-0.5"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.source}-${suggestion.field}-${suggestion.operator}-${index}`}
                ref={index === selectedIndex ? selectedItemRef : null}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full flex-col items-start gap-1 rounded-sm p-2 text-left transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  index === selectedIndex && "bg-accent text-accent-foreground"
                )}
              >
                <div className="text-sm font-medium">
                  {renderSuggestionContent(suggestion)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.sourceDisplay}: {suggestion.fieldDisplay}{" "}
                  {suggestion.operatorDisplay}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions &&
        suggestions.length === 0 &&
        query &&
        !externalLoading &&
        !isPending && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-4 shadow-md">
            <p className="text-sm text-muted-foreground">
              Presiona Enter para buscar "{query}" en todos los campos
            </p>
          </div>
        )}
    </div>
  );
}

export { InputDebounce };
