import type { Meta, StoryObj } from "@storybook/react"
import  React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GridScheme } from  "../components/custom/ConciliationGrid/GridScheme"
import { useToast } from "../hooks/ui/use-toast"
import { generatePaginatedData, mockData } from "../mocks/table-data"
import type { GridDTO, GridProps } from "../types/components/custom-table-conciliation-type"
import { RefreshCw, Download, Filter } from "lucide-react"
import { Button } from "../components/ui/button"

const meta: Meta<typeof GridScheme> = {
  title: "Components/ConciliationGrid",
  component: GridScheme,
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
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GridScheme>

interface GridWithStateProps extends GridProps {
  simulateError?: boolean
  updateInterval?: number
}

const GridWithState: React.FC<GridWithStateProps> = (args) => {
  const [data, setData] = useState<GridDTO>(() => generatePaginatedData(1, args.data?.pagination?.rows || 10))
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(args.data?.pagination?.rows || 10)
  const [isLoading, setIsLoading] = useState(args.isLoading || false)
  const { toast } = useToast()

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<GridDTO | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (args.simulateError) {
        throw new Error("Error simulado en la carga de datos")
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      const newData = generatePaginatedData(currentPage, rowsPerPage)
      setData(newData)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, rowsPerPage, args.simulateError, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }, [])

  // Función para actualizar datos manualmente con todos los tipos de esquemas
  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    toast({
      title: "Actualizando datos",
      description: "Obteniendo la información más reciente...",
      variant: "info",
    })

    // Simular la actualización con diferentes tipos de estados
    setTimeout(() => {
      const updatedData = JSON.parse(JSON.stringify(data))

      // Seleccionar aleatoriamente filas para marcarlas con diferentes estados
      const rowIndices = new Set<number>()
      const totalRows = updatedData.sources[0].body.datarows.length

      // Seleccionar más filas para mostrar todos los tipos
      while (rowIndices.size < 5) {
        rowIndices.add(Math.floor(Math.random() * totalRows))
      }

      // Convertir a array para asignar diferentes tipos
      const rowIndicesArray = Array.from(rowIndices)

      // Actualizar los datos y marcar las filas con diferentes estados
      if (updatedData["updating-rows"]) {
        const updatingRows = [...updatedData["updating-rows"].rows]

        // Primero, marcar todas las filas actualizadas anteriormente como NONE
        updatingRows.forEach((row, idx) => {
          if (row.type !== "NONE") {
            updatingRows[idx] = { type: "NONE" }
          }
        })

        // Asignar diferentes tipos de actualización
        if (rowIndicesArray.length >= 5) {
          updatingRows[rowIndicesArray[0]] = { type: "NEW" }
          updatingRows[rowIndicesArray[1]] = { type: "UPDATED" }
          updatingRows[rowIndicesArray[2]] = { type: "PROCESSING" }
          updatingRows[rowIndicesArray[3]] = { type: "ADJUSTED" }
          updatingRows[rowIndicesArray[4]] = { type: "ERROR" }
        }

        updatedData["updating-rows"].rows = updatingRows
      }

      // También actualizar algunos datos para simular cambios reales
      rowIndicesArray.forEach((index) => {
        updatedData.sources.forEach((source) => {
          if (source.body.datarows[index]) {
            // Actualizar algunos campos aleatorios
            if (source.body.datarows[index]["[Importe]"]) {
              source.body.datarows[index]["[Importe]"] = (Math.random() * 1000000).toFixed(2)
            }
            if (source.body.datarows[index]["[UUIDEstadoConciliacion]"]) {
              const estadoOptions = ["1", "2", "3", "4", "5", "6", "7"]
              source.body.datarows[index]["[UUIDEstadoConciliacion]"] =
                estadoOptions[Math.floor(Math.random() * estadoOptions.length)]
            }
          }
        })
      })

      setData(updatedData)
      setIsLoading(false)
      toast({
        title: "Datos actualizados",
        description: `Se actualizaron ${rowIndices.size} registros con diferentes estados`,
        variant: "success",
      })

      console.log("Filas actualizadas con diferentes estados:", {
        rowIndices: Array.from(rowIndices),
        updatingRows: updatedData["updating-rows"].rows
          .map((r, i) => (r.type !== "NONE" ? { index: i, type: r.type } : null))
          .filter(Boolean),
      })
    }, 1200)
  }, [data, toast])

  const ToolbarComponent = (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Conciliación de Transacciones</h2>
        <span className="text-sm text-muted-foreground">{data.pagination.total} registros en total</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
    </div>
  )

  const gridProps = useMemo(
    () => ({
      ...args,
      data,
      isLoading,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      ToolbarComponent,
    }),
    [args, data, isLoading, handlePageChange, handleRowsPerPageChange, ToolbarComponent],
  )

  return <GridScheme {...gridProps} />
}

export const ConciliationGrid: Story = {
  render: (args) => <GridWithState {...args} />,
  args: {
    data: mockData,
    showPagination: true,
    syncScroll: true,
    isLoading: false,
    defaultPanelSizes: [33.33, 33.33, 33.33],
    additionalSourceOrder: [1, 2], // Cambiado a [1, 2] para mostrar Galicia y luego Coelsa
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
}

