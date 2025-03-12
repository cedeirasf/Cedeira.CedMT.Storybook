import type { MutableRefObject } from "react";
import type { ITableSizeNoGroup } from "@/types/components/custom-table-conciliation-type";
import type React from "react";

export interface CBSTContextProps {
  availablePixels: number;
  scrollRef: MutableRefObject<(HTMLDivElement | null)[]>;
  handleScroll: (event: React.UIEvent<HTMLDivElement>, index: number) => void;
  setTableSizes: React.Dispatch<React.SetStateAction<ITableSizeNoGroup>>;
  // toolbarRef: MutableRefObject<HTMLDivElement | null>
  toolbarHeight: number;
  // footerRef: MutableRefObject<HTMLDivElement | null>
  footerHeight: number;
  // containerRef: MutableRefObject<HTMLDivElement | null>
}
