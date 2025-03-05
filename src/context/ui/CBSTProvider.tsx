"use client";

import React from "react";
import { type RefObject, useState, useRef, useEffect } from "react";
import { CBSTContext } from "./CBSTContext";
import type { ITableSizeNoGroup } from "@/types/components/custom-table-conciliation-type";

interface CBSTProviderProps {
  children: React.ReactNode;
  parentHeight?: number;
}

interface CBSTContextValue {
  availablePixels: number;
  scrollRef: RefObject<(HTMLDivElement | null)[]>;
  handleScroll: (event: React.UIEvent<HTMLDivElement>, index: number) => void;
  setTableSizes: React.Dispatch<React.SetStateAction<ITableSizeNoGroup>>;
  // toolbarRef: RefObject<HTMLDivElement>;
  toolbarHeight: number;
  // footerRef: RefObject<HTMLDivElement>;
  footerHeight: number;
  // containerRef: RefObject<HTMLDivElement>;
}

export const CBSTProvider = ({ children, parentHeight }: CBSTProviderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<(HTMLDivElement | null)[]>([]);

  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [availablePixels, setAvailablePixels] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const setTableSizes = useState<ITableSizeNoGroup>({
    column: [],
    rows: [],
  })[1];

  // useResizeObserver(containerRef, setContainerHeight);
  // useResizeObserver(toolbarRef, setToolbarHeight);
  // useResizeObserver(footerRef, setFooterHeight);

  useEffect(() => {
    const height = parentHeight || containerHeight;
    const availableHeight = height - toolbarHeight - footerHeight;
    setAvailablePixels(Math.max(availableHeight, 0));
  }, [parentHeight, containerHeight, toolbarHeight, footerHeight]);

  const handleScroll = (
    event: React.UIEvent<HTMLDivElement>,
    sourceIndex: number
  ) => {
    const newScrollTop = event.currentTarget.scrollTop;

    if (!scrollRef.current) return;

    scrollRef.current.forEach((ref, i) => {
      if (i !== sourceIndex && ref && ref.scrollTop !== newScrollTop) {
        ref.scrollTop = newScrollTop;
      }
    });
  };

  const contextValue: CBSTContextValue = {
    availablePixels,
    scrollRef,
    handleScroll,
    setTableSizes,
    // toolbarRef,
    toolbarHeight,
    // footerRef,
    footerHeight,
    // containerRef,
  };

  return (
    <div ref={containerRef} className="h-full">
      <CBSTContext.Provider value={contextValue}>
        {children}
      </CBSTContext.Provider>
    </div>
  );
};
