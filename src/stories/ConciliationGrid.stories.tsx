import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { GridScheme } from "../components/custom/ConciliationGrid/GridScheme"
import { useToast } from "../hooks/ui/use-toast"
import { generatePaginatedData, updateRandomRecords, generateRow } from "../mocks/table-data"
import type { GridDTO, GridProps } from "../types/components/custom-table-conciliation-type"
import { RefreshCw, Download, Filter, Plus } from "lucide-react"
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
- 🔔 Notificación visual de cambios en filas
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

  // Cargar datos iniciales
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

  // Actualización automática
  useEffect(() => {
    if (isLoading || args.simulateError) return

    const updateData = () => {
      setData((prevData) => {
        // Actualizar registros aleatorios
        const { updatedData, updatedRows } = updateRandomRecords(prevData, 3)

        // Mostrar notificación
        if (updatedRows.size > 0) {
          toast({
            title: "Actualización automática",
            description: `Se actualizaron ${updatedRows.size} registros`,
            variant: "info",
          })
        }

        return updatedData
      })
    }

    // Configurar intervalo de actualización
    const interval = setInterval(updateData, 5000) // Aumentado a 5 segundos para mejor visualización

    // Ejecutar una actualización inicial después de 2 segundos
    const initialTimeout = setTimeout(() => {
      updateData()
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [isLoading, args.simulateError, toast])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((column: string, direction: "asc" | "desc") => {
    setData((prevData) => {
      const sortedData = { ...prevData }
      sortedData.sources = prevData.sources.map((source) => ({
        ...source,
        body: {
          ...source.body,
          datarows: [...source.body.datarows].sort((a, b) => {
            const aValue = a[column]
            const bValue = b[column]

            if (aValue == null && bValue == null) return 0
            if (aValue == null) return direction === "asc" ? -1 : 1
            if (bValue == null) return direction === "asc" ? 1 : -1

            if (typeof aValue === "string" && typeof bValue === "string") {
              return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
              return direction === "asc" ? aValue - bValue : bValue - aValue
            }

            const aStr = String(aValue)
            const bStr = String(bValue)
            return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
          }),
        },
      }))
      return sortedData
    })
  }, [])

  const handleAddNewRows = useCallback(() => {
    setIsLoading(true)
    toast({
      title: "Añadiendo nuevos registros",
      description: "Agregando nuevos registros a la grilla...",
      variant: "info",
    })

    // Simular la adición de nuevas filas
    setTimeout(() => {
      const updatedData = JSON.parse(JSON.stringify(data))

      // Seleccionar aleatoriamente 2 filas para marcarlas como nuevas
      const newRowIndices = new Set<number>()
      const totalRows = updatedData.sources[0].body.datarows.length

      while (newRowIndices.size < 2) {
        newRowIndices.add(Math.floor(Math.random() * totalRows))
      }

      // Actualizar los datos y marcar las filas como nuevas
      if (updatedData["updating-rows"]) {
        const updatingRows = [...updatedData["updating-rows"].rows]

        // Primero, marcar todas las filas actualizadas anteriormente como NONE
        updatingRows.forEach((row, idx) => {
          if (row.type === "UPDATED" || row.type === "NEW") {
            updatingRows[idx] = { type: "NONE" }
          }
        })

        // Luego, marcar las filas nuevas
        newRowIndices.forEach((index) => {
          updatingRows[index] = { type: "NEW" }
          // También actualizar los datos para simular cambios reales
          updatedData.sources.forEach((source) => {
            source.body.datarows[index] = {
              ...source.body.datarows[index],
              ...generateRow(index),
            }
          })
        })

        updatedData["updating-rows"].rows = updatingRows
      }

      setData(updatedData)
      setIsLoading(false)
      toast({
        title: "Nuevos registros añadidos",
        description: `Se añadieron ${newRowIndices.size} nuevos registros`,
        variant: "success",
      })
    }, 1200)
  }, [data, toast])

  // Create a custom toolbar component that includes the UpdatedRowsCounter
  const ToolbarComponent = useMemo(() => {
    if (args.ToolbarComponent) return args.ToolbarComponent

    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Conciliación de Transacciones</h2>
          <span className="text-sm text-muted-foreground">{data.pagination.total} registros en total</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => loadData()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddNewRows} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Nuevos
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    )
  }, [args.ToolbarComponent, loadData, data.pagination.total, isLoading, handleAddNewRows])

  const gridProps = useMemo(
    () => ({
      ...args,
      data,
      isLoading,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      onSort: handleSort,
      ToolbarComponent: ToolbarComponent,
    }),
    [args, data, isLoading, handlePageChange, handleRowsPerPageChange, handleSort, ToolbarComponent],
  )

  return <GridScheme {...gridProps} />
}

export const ConciliationGrid: Story = {
  render: (args) => <GridWithState {...args} />,
  args: {
    data: generatePaginatedData(1, 10), // Generar datos iniciales aquí
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
}

