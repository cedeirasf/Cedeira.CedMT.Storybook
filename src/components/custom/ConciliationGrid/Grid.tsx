import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  GridProps,
  Source,
} from "@/types/components/custom-table-conciliation-type";
import { GripVertical } from "lucide-react";
import { CBSTProvider } from "@/context/ui/CBSTProvider";
import { CustomToast } from "../CustomToast";
import { ErrorBoundary } from "./ErrorBoundary";
import { GridContent } from "./GridContent";
import { Pagination } from "./Pagination";
import { TableOverflowContainer } from "./TableOverflowContainer";

// Nuevo tipo para el estado de ordenamiento
type SortState = {
  column: string | null;
  direction: "asc" | "desc";
};

const GridWithContext: React.FC<GridProps> = ({
  data,
  className,
  onPageChange,
  onRowsPerPageChange,
  showPagination = true,
  syncScroll = true,
  defaultPanelSizes,
  isLoading = false,
  onError,
  additionalSourceOrder,
}) => {
  const [sizes, setSizes] = useState<number[]>(
    defaultPanelSizes ||
      Array(Math.min(data.sources.length, 3)).fill(
        100 / Math.min(data.sources.length, 3)
      )
  );
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrolling = useRef(false);

  // Nuevo estado para el ordenamiento
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: "asc",
  });

  const orderedSources = useMemo(() => {
    const sources = [data.sources[0]];
    if (additionalSourceOrder && additionalSourceOrder.length > 0) {
      additionalSourceOrder.slice(0, 2).forEach((index) => {
        if (index > 0 && index < data.sources.length) {
          sources.push(data.sources[index]);
        }
      });
    } else {
      sources.push(...data.sources.slice(1, 3));
    }
    return sources;
  }, [data.sources, additionalSourceOrder]);

  const calculatedRowsPerPageOptions = useMemo(() => {
    const baseOptions = [10, 25, 50, 100, 250, 500];
    const totalRows = data.pagination.total;
    const currentRows = data.pagination.rows;
    const maxRowsPerPage = 1000;

    return [
      ...new Set([
        ...baseOptions.filter(
          (option) => option <= Math.min(totalRows, maxRowsPerPage)
        ),
        currentRows,
        ...(totalRows > maxRowsPerPage ? [maxRowsPerPage] : []),
      ]),
    ].sort((a, b) => a - b);
  }, [data.pagination.total, data.pagination.rows]);

  const handleScroll = useCallback(
    (sourceIndex: number) => (event: React.UIEvent<HTMLDivElement>) => {
      if (!syncScroll || isScrolling.current) return;
      const { scrollTop } = event.currentTarget;
      isScrolling.current = true;
      scrollRefs.current.forEach((ref, index) => {
        if (index !== sourceIndex && ref) {
          ref.scrollTop = scrollTop;
        }
      });
      isScrolling.current = false;
    },
    [syncScroll]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback(
    (rows: number) => {
      onRowsPerPageChange?.(rows);
    },
    [onRowsPerPageChange]
  );

  const handleError = useCallback(
    (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  // Nueva función para manejar el ordenamiento
  const handleSort = useCallback((column: string) => {
    setSortState((prevState) => ({
      column,
      direction:
        prevState.column === column && prevState.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  // Función para aplicar el ordenamiento a los datos
  const sortData = useCallback(
    (source: Source): Source => {
      if (!sortState.column) return source;

      const sortedDatarows = [...source.body.datarows].sort((a, b) => {
        const aValue = a[sortState.column!] as string | number;
        const bValue = b[sortState.column!] as string | number;

        // If either value is null/undefined, treat them as equal
        if (aValue == null || bValue == null) return 0;

        // Handle numeric comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortState.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle string comparison
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortState.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });

      return {
        ...source,
        body: {
          ...source.body,
          datarows: sortedDatarows,
        },
      };
    },
    [sortState]
  );

  // Aplicar el ordenamiento a las fuentes de datos
  const sortedSources = useMemo(() => {
    return orderedSources.map(sortData);
  }, [orderedSources, sortData]);

  const gridContent = (
    <div className="h-full overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg bg-white"
        onLayout={(newSizes) => {
          setSizes(newSizes);
        }}
        autoSaveId="grid-layout"
      >
        {sortedSources.map((source, index) => (
          <React.Fragment key={source.source}>
            <ResizablePanel
              defaultSize={sizes[index]}
              minSize={0}
              collapsible={true}
              collapsedSize={0}
            >
              <div className="h-full rounded-lg border-2 overflow-hidden relative">
                <GridContent
                  source={source}
                  currentPage={data.pagination.page}
                  conditionalRowFormat={data["conditional-row-format"]}
                  onScroll={handleScroll(index)}
                  syncScroll={syncScroll}
                  rowsPerPage={data.pagination.rows}
                  scrollRef={(el) => (scrollRefs.current[index] = el)}
                  isLoading={isLoading}
                  onSort={handleSort}
                  sortState={sortState}
                />
              </div>
            </ResizablePanel>
            {index < sortedSources.length - 1 && (
              <ResizableHandle withHandle>
                <GripVertical className="h-4 w-4" />
              </ResizableHandle>
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );

  const paginationComponent = showPagination ? (
    <Pagination
      pagination={data.pagination}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={calculatedRowsPerPageOptions}
      isLoading={isLoading}
    />
  ) : null;

  return (
    <>
      <ErrorBoundary
        onError={handleError}
        fallback={
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                No hay datos disponibles
              </h2>
              <p className="text-sm text-gray-600">
                No se pudieron cargar los datos. Por favor, intente nuevamente
                más tarde.
              </p>
            </div>
          </div>
        }
      >
        <div className={cn("h-full", className)}>
          <TableOverflowContainer
            Toolbar={<div className="p-4">Toolbar placeholder</div>}
            Table={gridContent}
            Pagination={paginationComponent}
          />
        </div>
      </ErrorBoundary>
    </>
  );
};

export const Grid: React.FC<GridProps> = (props) => (
  <CBSTProvider>
    <CustomToast />
    <GridWithContext {...props} />
  </CBSTProvider>
);
