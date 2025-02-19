import React, { memo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/custom/CustomSheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  AdvancedFilterInputProps,
  ChannelViewFilterSchemeResponse,
  Filter,
  FilterScheme,
} from "@/types/components/custom-advanced-input-filter.type";
import { FilterIcon, Plus, Trash2 } from "lucide-react";
import TagFilter from "../CustomTagFilter";
import { DropdownFilterList } from "./DropdownFilterList";

import { useAdvancedFilter } from "@/hooks/use-advanced-filter";
import { FilterForm } from "./FilterForm";
import { FilterTagTooltip } from "./FilterTagTooltip";
import { InputDebounce } from "./InputDebounce";

export function AdvancedFilterInput({
  selectedFilters,
  onFiltersChange,
  onSearch,
  filterScheme,
  sources,
  className,
}: AdvancedFilterInputProps) {
  const {
    isSheetOpen,
    setIsSheetOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedFilter,
    localFilters,
    localSources,
    localFilterScheme,
    searchQuery,
    isPending,
    handleSearch,
    handleFilterSelect,
    handleAddNewFilter,
    handleFilterSubmit,
    handleFilterEdit,
    handleRemoveFilter,
    handleClearAll,
    getFilterDisplayText,
  } = useAdvancedFilter({
    selectedFilters,
    onFiltersChange,
    onSearch,
    filterScheme,
    sources,
  });

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="relative">
        <InputDebounce
          value={searchQuery}
          onSearch={handleSearch}
          onSelect={handleFilterSelect}
          placeholder="Buscar filtros..."
          className="pl-10 pr-[90px]"
          filterScheme={localFilterScheme}
          sources={localSources}
          isLoading={isPending}
          selectedFilters={localFilters}
        />
        <FilterActions
          filters={localFilters}
          onEdit={handleFilterEdit}
          onRemove={handleRemoveFilter}
          getFilterDisplayText={getFilterDisplayText}
          filterScheme={localFilterScheme}
          sources={localSources}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onAddNew={handleAddNewFilter}
          onClearAll={handleClearAll}
        />
      </div>

      <FilterFormSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedFilter={selectedFilter}
        onSubmit={handleFilterSubmit}
        filterScheme={localFilterScheme}
        sources={localSources}
      />
    </div>
  );
}

interface FilterActionsProps {
  filters: Filter[];
  onEdit: (filter: Filter) => void;
  onRemove: (filter: Filter) => void;
  getFilterDisplayText: (filter: Filter) => string;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onAddNew: () => void;
  onClearAll: () => void;
}

const FilterActions = memo(function FilterActions({
  filters,
  onEdit,
  onRemove,
  getFilterDisplayText,
  filterScheme,
  sources,
  isDropdownOpen,
  setIsDropdownOpen,
  onAddNew,
  onClearAll,
}: FilterActionsProps) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <FilterTags
        filters={filters}
        onEdit={onEdit}
        onRemove={onRemove}
        getFilterDisplayText={getFilterDisplayText}
        filterScheme={filterScheme}
        sources={sources}
      />
      <FilterDropdown
        filters={filters}
        onEdit={onEdit}
        onRemove={onRemove}
        filterScheme={filterScheme}
        sources={sources}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        onAddNew={onAddNew}
        onClearAll={onClearAll}
      />
    </div>
  );
});

interface FilterTagsProps {
  filters: Filter[];
  onEdit: (filter: Filter) => void;
  onRemove: (filter: Filter) => void;
  getFilterDisplayText: (filter: Filter) => string;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
}

const FilterTags = memo(function FilterTags({
  filters,
  onEdit,
  onRemove,
  getFilterDisplayText,
  filterScheme,
  sources,
}: FilterTagsProps) {
  return (
    <div className=" items-center gap-1 hidden md:flex lg:flex ">
      {filters.slice(0, 2).map((filter, index) => (
        <FilterTagTooltip
          key={`filter-${filter.source}-${filter.field}-${filter.value}-${index}`}
          filter={filter}
          filterScheme={filterScheme}
          sources={sources}
          side="bottom"
        >
          <div className="cursor-pointer">
            <TagFilter
              label={getFilterDisplayText(filter)}
              onClick={() => onEdit(filter)}
              onRemove={() => onRemove(filter)}
              color="neutral"
              size="sm"
              rounded="md"
              className="shrink-0 bg-secondary/80 text-xs hover:bg-secondary max-w-[100px]"
              truncate
            />
          </div>
        </FilterTagTooltip>
      ))}
    </div>
  );
});

interface FilterDropdownProps {
  filters: Filter[];
  onEdit: (filter: Filter) => void;
  onRemove: (filter: Filter) => void;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNew: () => void;
  onClearAll: () => void;
}

const FilterDropdown = memo(function FilterDropdown({
  filters,
  onEdit,
  onRemove,
  filterScheme,
  sources,
  isOpen,
  onOpenChange,
  onAddNew,
  onClearAll,
}: FilterDropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-secondary hover:bg-secondary/80"
        >
          <FilterIcon className="h-4 w-4" />
          {filters.length > 2 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {filters.length - 2}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[280px] sm:w-[480px] p-0"
        sideOffset={8}
      >
        <div className="flex flex-col h-[300px]">
          <ScrollArea className="flex-1">
            <DropdownFilterList
              filters={filters}
              onSelect={onEdit}
              onRemove={onRemove}
              variant="grid"
              filterScheme={filterScheme}
              sources={sources}
            />
          </ScrollArea>
          <div className="flex justify-end gap-2 border-t p-2 bg-popover">
            <Button
              size="sm"
              onClick={onAddNew}
              variant="default"
              className="h-8"
            >
              <Plus className="mr-2 h-3 w-3" />
              Agregar
            </Button>
            {filters.length > 0 && (
              <Button
                size="sm"
                onClick={onClearAll}
                variant="destructive"
                className="h-8"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

interface FilterFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilter: Partial<Filter> | null;
  onSubmit: (filter: Filter) => void;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
}

const FilterFormSheet = memo(function FilterFormSheet({
  isOpen,
  onOpenChange,
  selectedFilter,
  onSubmit,
  filterScheme,
  sources,
}: FilterFormSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {selectedFilter ? "Editar filtro" : "Nuevo filtro"}
          </SheetTitle>
          <SheetDescription>
            {selectedFilter
              ? "Modifica los valores del filtro"
              : "Configura un nuevo filtro"}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <FilterForm
            key={
              selectedFilter ? `edit-${JSON.stringify(selectedFilter)}` : "new"
            }
            initialFilter={selectedFilter as Filter | null}
            onSubmit={onSubmit}
            filterScheme={filterScheme}
            sources={sources}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
});
