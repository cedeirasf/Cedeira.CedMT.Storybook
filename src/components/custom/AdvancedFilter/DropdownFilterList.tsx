import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  ChannelViewFilterSchemeResponse,
  Filter,
  FilterScheme,
} from "@/types/components/custom-advanced-input-filter.type";
import { cn } from "@/lib/utils";
import { FilterTagTooltip } from "./FilterTagTooltip";
import { useDropdownFilterList } from "@/hooks/use-dropdown-filter-list";
import TagFilter from "../CustomTagFilter";

interface DropdownFilterListProps {
  filters: Filter[];
  onSelect?: (filter: Filter) => void;
  onRemove?: (filter: Filter) => void;
  variant?: "grid" | "list";
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
  className?: string;
}

export function DropdownFilterList({
  filters,
  onSelect,
  onRemove,
  variant = "list",
  filterScheme,
  sources,
  className,
}: DropdownFilterListProps) {
  const { getFilterDisplayText } = useDropdownFilterList(filterScheme, sources);

  if (filters.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No hay filtros para mostrar
      </div>
    );
  }

  return (
    <ScrollArea
      className={cn("max-h-[320px] w-full", className)}
      scrollHideDelay={0}
    >
      {variant === "list" ? (
        <ListView
          filters={filters}
          onSelect={onSelect}
          getFilterDisplayText={getFilterDisplayText}
          filterScheme={filterScheme}
          sources={sources}
        />
      ) : (
        <GridView
          filters={filters}
          onSelect={onSelect}
          onRemove={onRemove}
          getFilterDisplayText={getFilterDisplayText}
          filterScheme={filterScheme}
          sources={sources}
        />
      )}
    </ScrollArea>
  );
}

interface ListViewProps {
  filters: Filter[];
  onSelect?: (filter: Filter) => void;
  getFilterDisplayText: (filter: Filter) => {
    label: string;
    source: string;
    field: string;
    value: string;
    dataType: string;
  };
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
}

const ListView = React.memo(function ListView({
  filters,
  onSelect,
  getFilterDisplayText,
  filterScheme,
  sources,
}: ListViewProps) {
  return (
    <div className="p-1 pr-4">
      {filters.map((filter, index) => {
        const { label } = getFilterDisplayText(filter);
        return (
          <FilterTagTooltip
            key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
            filter={filter}
            filterScheme={filterScheme}
            sources={sources}
          >
            <div
              onClick={() => onSelect?.(filter)}
              className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {label}
            </div>
          </FilterTagTooltip>
        );
      })}
    </div>
  );
});

interface GridViewProps {
  filters: Filter[];
  onSelect?: (filter: Filter) => void;
  onRemove?: (filter: Filter) => void;
  getFilterDisplayText: (filter: Filter) => {
    label: string;
    source: string;
    field: string;
    value: string;
    dataType: string;
  };
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
}

const GridView = React.memo(function GridView({
  filters,
  onSelect,
  onRemove,
  getFilterDisplayText,
  filterScheme,
  sources,
}: GridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
      {filters.map((filter, index) => (
        <FilterTagTooltip
          key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
          filter={filter}
          filterScheme={filterScheme}
          sources={sources}
        >
          <div className="w-full">
            <TagFilter
              label={getFilterDisplayText(filter).label}
              onClick={() => onSelect?.(filter)}
              onRemove={onRemove ? () => onRemove(filter) : undefined}
              color="neutral"
              size="md"
              rounded="md"
              className="w-full bg-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80"
              truncate
            />
          </div>
        </FilterTagTooltip>
      ))}
    </div>
  );
});
