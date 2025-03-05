import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Grid } from "../components/custom/ConciliationGrid/Grid";
import { CBSTProvider } from "../context/ui/CBSTProvider";
import { useToast } from "../hooks/ui/use-toast";
import {
  mockData,
  generatePaginatedData,
  updateRandomRecords,
} from "../mocks/table-data";
import type {
  GridDTO,
  GridProps,
} from "../types/components/custom-table-conciliation-type";

const meta: Meta<typeof Grid> = {
  title: "Components/ConciliationGrid",
  component: Grid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
### Grid de Conciliación

Un componente avanzado para visualizar y comparar datos de múltiples fuentes con las siguientes características:

- 🔄 Actualización en tiempo real
- 📊 Múltiples fuentes de datos
- 📱 Diseño responsive
- 🔍 Scroll sincronizado
- 📑 Paginación configurable
- ↔️ Paneles redimensionables
- 🚨 Manejo de errores personalizado
- ⚡ Alto rendimiento optimizado
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen p-4 bg-gray-100">
        <CBSTProvider>
          <Story />
        </CBSTProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Grid>;

interface GridWithStateProps extends GridProps {
  simulateError?: boolean;
  updateInterval?: number;
}

const GridWithState: React.FC<GridWithStateProps> = (args) => {
  const [data, setData] = useState<GridDTO>(() =>
    generatePaginatedData(1, args.data?.pagination?.rows || 10)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(
    args.data?.pagination?.rows || 10
  );
  const [isLoading, setIsLoading] = useState(args.isLoading || false);
  const { toast } = useToast();

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<GridDTO | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (args.simulateError) {
        throw new Error("Error simulado en la carga de datos");
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      const newData = generatePaginatedData(currentPage, rowsPerPage);
      setData(newData);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, args.simulateError, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isLoading || args.simulateError) return;

    const updateData = () => {
      setData((prevData) => {
        const prevDataSnapshot = previousDataRef.current;
        if (
          prevDataSnapshot &&
          JSON.stringify(prevData) === JSON.stringify(prevDataSnapshot)
        ) {
          return prevData; // Skip update if data hasn't changed
        }

        const { updatedData, updatedRows } = updateRandomRecords(prevData, 2);
        previousDataRef.current = updatedData;

        if (updatedRows.size > 0) {
          toast({
            title: "Datos actualizados",
            description: `Se actualizaron ${updatedRows.size} registros`,
            variant: "info",
          });
        }

        return updatedData;
      });
    };

    updateTimeoutRef.current = setTimeout(
      updateData,
      args.updateInterval || 5000
    );

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [isLoading, args.simulateError, args.updateInterval, toast]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (column: string, direction: "asc" | "desc") => {
      setData((prevData) => {
        const sortedData = { ...prevData };
        sortedData.sources = prevData.sources.map((source) => ({
          ...source,
          body: {
            ...source.body,
            datarows: [...source.body.datarows].sort((a, b) => {
              const aValue = a[column];
              const bValue = b[column];

              if (aValue == null && bValue == null) return 0;
              if (aValue == null) return direction === "asc" ? -1 : 1;
              if (bValue == null) return direction === "asc" ? 1 : -1;

              if (typeof aValue === "string" && typeof bValue === "string") {
                return direction === "asc"
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
              }

              if (typeof aValue === "number" && typeof bValue === "number") {
                return direction === "asc" ? aValue - bValue : bValue - aValue;
              }

              const aStr = String(aValue);
              const bStr = String(bValue);
              return direction === "asc"
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
            }),
          },
        }));
        return sortedData;
      });
    },
    []
  );

  const gridProps = useMemo(
    () => ({
      ...args,
      data,
      isLoading,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      onSort: handleSort,
    }),
    [
      args,
      data,
      isLoading,
      handlePageChange,
      handleRowsPerPageChange,
      handleSort,
    ]
  );

  return <Grid {...gridProps} />;
};

export const ConciliationGrid: Story = {
  render: (args) => <GridWithState {...args} />,
  args: {
    data: mockData,
    showPagination: true,
    syncScroll: true,
    isLoading: false,
    defaultPanelSizes: [33.33, 33.33, 33.33],
    additionalSourceOrder: [2, 1],
    rowsPerPageOptions: [10, 25, 50, 100],
    simulateError: false,
    updateInterval: 5000,
    className: "border rounded-lg h-full",
  },
  argTypes: {
    showPagination: {
      control: "boolean",
      description: "Controla la visibilidad de la paginación",
    },
    syncScroll: {
      control: "boolean",
      description: "Habilita/deshabilita el scroll sincronizado entre paneles",
    },
    isLoading: {
      control: "boolean",
      description: "Controla el estado de carga del componente",
    },
    defaultPanelSizes: {
      control: "object",
      description: "Define el tamaño inicial de los paneles (en porcentaje)",
    },
    additionalSourceOrder: {
      control: "object",
      description: "Define el orden de las fuentes adicionales",
    },
    rowsPerPageOptions: {
      control: "object",
      description: "Define las opciones de filas por página disponibles",
    },
    simulateError: {
      control: "boolean",
      description: "Simula un error en la carga de datos",
    },
    updateInterval: {
      control: "number",
      description: "Intervalo de actualización en milisegundos",
    },
    className: {
      control: "text",
      description: "Clases CSS adicionales para el contenedor",
    },
  },
};
