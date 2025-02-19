import type { LucideIcon } from "lucide-react";
import { Database, Tag } from "lucide-react";
import * as React from "react";
import type {
  Filter,
  FilterScheme,
  ChannelViewFilterSchemeResponse,
} from "@/types/components/custom-advanced-input-filter.type";
import { cn } from "@/lib/utils";
import { useFilterTagTooltip } from "@/hooks/use-filter-tag-tooltip";
import { CustomTooltip } from "../CustomTooltip";

interface FilterTagTooltipProps {
  filter: Filter;
  filterScheme: FilterScheme;
  sources: ChannelViewFilterSchemeResponse["sources"];
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  iconMapping?: Record<string, LucideIcon>;
  defaultIcon?: LucideIcon;
  sourceIcon?: LucideIcon;
  fieldIcon?: LucideIcon;
  tooltipContentClassName?: string;
  sectionClassNames?: {
    source?: string;
    field?: string;
    value?: string;
  };
}

export const FilterTagTooltip: React.FC<FilterTagTooltipProps> = ({
  filter,
  filterScheme,
  sources,
  children,
  side = "top",
  align = "center",
  iconMapping = {},
  defaultIcon,
  sourceIcon,
  fieldIcon,
  tooltipContentClassName,
  sectionClassNames,
}) => {
  const { displayData, getValueIcon } = useFilterTagTooltip(
    filter,
    filterScheme,
    sources,
    iconMapping
  );

  return (
    <CustomTooltip
      trigger={children}
      variant="info"
      side={side}
      align={align}
      delayDuration={0}
      disableHoverableContent={false}
    >
      <TooltipContent
        {...displayData}
        getValueIcon={getValueIcon}
        defaultIcon={defaultIcon}
        sourceIcon={sourceIcon}
        fieldIcon={fieldIcon}
        tooltipContentClassName={tooltipContentClassName}
        sectionClassNames={sectionClassNames}
      />
    </CustomTooltip>
  );
};

interface TooltipContentProps {
  source: string;
  field: string;
  value: string;
  dataType: string;
  getValueIcon: (dataType: string) => LucideIcon;
  defaultIcon?: LucideIcon;
  sourceIcon?: LucideIcon;
  fieldIcon?: LucideIcon;
  tooltipContentClassName?: string;
  sectionClassNames?: {
    source?: string;
    field?: string;
    value?: string;
  };
}

const TooltipContent = React.memo(function TooltipContent({
  source,
  field,
  value,
  dataType,
  getValueIcon,
  defaultIcon = Tag,
  sourceIcon: SourceIcon = Database,
  fieldIcon: FieldIcon = Tag,
  tooltipContentClassName = "",
  sectionClassNames = {},
}: TooltipContentProps) {
  const ValueIcon = getValueIcon(dataType) || defaultIcon;

  return (
    <div className={cn("max-w-[280px] space-y-2 p-1", tooltipContentClassName)}>
      <div className={cn("flex items-center gap-2", sectionClassNames.source)}>
        <SourceIcon className="h-4 w-4 text-primary" />
        <div className="font-medium text-sm">{source}</div>
      </div>
      <div className={cn("flex items-center gap-2", sectionClassNames.field)}>
        <FieldIcon className="h-4 w-4 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">{field}</div>
      </div>
      <div className={cn("flex items-center gap-2", sectionClassNames.value)}>
        <ValueIcon className="h-4 w-4 text-foreground" />
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
});

export default FilterTagTooltip;
