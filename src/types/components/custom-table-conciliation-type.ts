import { JSX } from "react";

export interface GridProps {
  data: GridDTO;
  className?: string;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  showPagination?: boolean;
  syncScroll?: boolean;
  defaultPanelSizes?: number[];
  isLoading: boolean;
  ToolbarComponent?: JSX.Element;
  onError?: (error: Error) => void;
  additionalSourceOrder?: number[]; // Prop for selecting and ordering additional sources
  onSort?: (column: string, direction: "asc" | "desc") => void; // Nueva prop para manejar el ordenamiento
}

export interface GridDTO {
  view: string;
  pagination: Pagination;
  behaviors: Behaviors;
  sources: Source[];
  "conditional-row-format": ConditionalRowFormat[];
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  rows: number;
}

export interface Behaviors {
  exportable: boolean;
  [key: string]: boolean | string | number | undefined;
}

export interface Source {
  source: string;
  display: string;
  behaviors: SourceBehaviors;
  body: SourceBody;
  footer?: SourceFooter;
}

export interface SourceBehaviors {
  isSticky: boolean;
  [key: string]: boolean | string | number | undefined;
}

export interface SourceBody {
  scheme: { [key: string]: SchemeColumn };
  datarows: Datarow[];
}

export interface SourceFooter {
  scheme: { [key: string]: SchemeColumn };
  datarows: Datarow[];
}

export interface SchemeColumn {
  display: string;
  data_type: DataType;
  behaviors: ColumnBehaviors;
}

export interface DataType {
  primitive: "string" | "number" | "datetime" | "boolean" | "status";
  format?: string;
  styles?: string[];
  options?: ColumnOption[];
}

export interface ColumnBehaviors {
  sortable: boolean;
  visible: boolean;
  [key: string]: boolean | string | number | undefined;
}

export interface ColumnOption {
  value: string;
  display: string;
  styles?: string[];
}

export interface Datarow {
  [key: string]: string | number | boolean | undefined;
}

export interface ConditionalRowFormat {
  "index-rows": number[];
  styles: string[];
}

export interface ITableSizeNoGroup {
  column: number[];
  rows: number[];
}

export type TableData = {
  [key: string]: string | number | boolean | null | undefined;
};
