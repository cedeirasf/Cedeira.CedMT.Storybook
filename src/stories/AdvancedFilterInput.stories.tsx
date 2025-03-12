import type { Meta, StoryObj } from "@storybook/react";
import { AdvancedFilterInput } from "../components/custom/AdvancedFilter/AdvancedFilterInput";
import { mockChannelViewFilterSchemeResponse } from "../mocks/filter-data";
import { useState } from "react";
import * as React from "react";

/**
 * Configuración de la historia para el componente AdvancedFilterInput
 * @type Meta
 */
const meta: Meta<typeof AdvancedFilterInput> = {
  /** Ubicación en el árbol de historias de Storybook */
  title: "Components/ui/AdvancedFilterInput",
  /** Componente que se está documentando */
  component: AdvancedFilterInput,
  /** Configuración del layout para la visualización */
  parameters: {
    layout: "centered",
  },
  /** Decoradores para envolver las historias */
  decorators: [
    (Story, context) => {
      const theme =
        context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

      if (typeof window !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }

      return (
        <div className="md:w-[600px] p-4">
          <Story />
        </div>
      );
    },
  ],
  /** Documentación de los argumentos del componente */
  args: {
    /** Array de filtros seleccionados actualmente */
    selectedFilters: mockChannelViewFilterSchemeResponse.filters,
    /** Función que se ejecuta cuando cambian los filtros */
    onFiltersChange: (filters) => console.log("Filtros actualizados:", filters),
    /** Función asíncrona para realizar búsquedas */
    onSearch: async (query) => {
      console.log("Buscando:", query);
      return mockChannelViewFilterSchemeResponse;
    },
    /** Esquema que define los tipos de datos y operadores */
    filterScheme: mockChannelViewFilterSchemeResponse.scheme,
    /** Fuentes de datos disponibles */
    sources: mockChannelViewFilterSchemeResponse.sources,
  },
  /** Documentación de los argumentos */
  argTypes: {
    selectedFilters: {
      description: "Array de filtros seleccionados actualmente",
      control: "object",
    },
    onFiltersChange: {
      description: "Función que se ejecuta cuando cambian los filtros",
    },
    onSearch: {
      description: "Función asíncrona para realizar búsquedas",
    },
    filterScheme: {
      description: "Esquema que define los tipos de datos y operadores",
      control: "object",
    },
    sources: {
      description: "Fuentes de datos disponibles",
      control: "object",
    },
    className: {
      description: "Clase CSS opcional para personalizar el contenedor",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdvancedFilterInput>;

/**
 * Historia predeterminada que muestra el componente con datos de ejemplo
 */
export const Predeterminado: Story = {
  render: function Renderizar() {
    // Asegurar que los filtros iniciales tengan el formato de fecha correcto
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() =>
      asegurarFechasValidas(mockChannelViewFilterSchemeResponse.filters)
    );

    const manejarBusqueda = async (consulta: string) => {
      console.log("Buscando con la consulta:", consulta);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...mockChannelViewFilterSchemeResponse,
        filters: filtrosSeleccionados,
      };
    };

    const manejarCambioFiltros = (nuevosFiltros) => {
      setFiltrosSeleccionados(asegurarFechasValidas(nuevosFiltros));
    };

    return (
      <AdvancedFilterInput
        selectedFilters={filtrosSeleccionados}
        onFiltersChange={manejarCambioFiltros}
        onSearch={manejarBusqueda}
        filterScheme={mockChannelViewFilterSchemeResponse.scheme}
        sources={mockChannelViewFilterSchemeResponse.sources}
      />
    );
  },
};

/**
 * Historia que muestra el componente sin filtros iniciales
 */
export const Vacio: Story = {
  render: function Renderizar() {
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);

    const manejarBusqueda = async (consulta: string) => {
      console.log("Buscando con la consulta:", consulta);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...mockChannelViewFilterSchemeResponse,
        filters: filtrosSeleccionados,
      };
    };

    const manejarCambioFiltros = (nuevosFiltros) => {
      setFiltrosSeleccionados(asegurarFechasValidas(nuevosFiltros));
    };

    return (
      <AdvancedFilterInput
        selectedFilters={filtrosSeleccionados}
        onFiltersChange={manejarCambioFiltros}
        onSearch={manejarBusqueda}
        filterScheme={mockChannelViewFilterSchemeResponse.scheme}
        sources={mockChannelViewFilterSchemeResponse.sources}
      />
    );
  },
};

/**
 * Historia que muestra el componente con una clase CSS personalizada
 */
export const ConClasePersonalizada: Story = {
  render: function Renderizar() {
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() =>
      asegurarFechasValidas(mockChannelViewFilterSchemeResponse.filters)
    );

    const manejarBusqueda = async (consulta: string) => {
      console.log("Buscando con la consulta:", consulta);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...mockChannelViewFilterSchemeResponse,
        filters: filtrosSeleccionados,
      };
    };

    const manejarCambioFiltros = (nuevosFiltros) => {
      setFiltrosSeleccionados(asegurarFechasValidas(nuevosFiltros));
    };

    return (
      <AdvancedFilterInput
        selectedFilters={filtrosSeleccionados}
        onFiltersChange={manejarCambioFiltros}
        onSearch={manejarBusqueda}
        filterScheme={mockChannelViewFilterSchemeResponse.scheme}
        sources={mockChannelViewFilterSchemeResponse.sources}
        className="border-2 border-primary p-4 rounded-xl"
      />
    );
  },
};

/**
 * Historia que muestra el componente con una lista extendida de fuentes
 */
export const ConListaFuentesLarga: Story = {
  render: function Renderizar() {
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() =>
      asegurarFechasValidas(mockChannelViewFilterSchemeResponse.filters)
    );

    // Crear lista extendida de fuentes
    const fuentesExtendidas = [
      ...mockChannelViewFilterSchemeResponse.sources,
      ...Array.from({ length: 5 }, (_, i) => ({
        source: `FuenteExtra${i + 1}`,
        display: `Fuente Extra ${i + 1}`,
        fields: {
          "[campo1]": {
            display: "Campo 1",
            data_type: "string",
            filteringTips: [
              {
                tip: `Consejo para Fuente Extra ${i + 1}`,
                filtering_operator: "eq",
              },
            ],
          },
        },
      })),
    ];

    const manejarBusqueda = async (consulta: string) => {
      console.log("Buscando con la consulta:", consulta);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...mockChannelViewFilterSchemeResponse,
        sources: fuentesExtendidas,
        filters: filtrosSeleccionados,
      };
    };

    const manejarCambioFiltros = (nuevosFiltros) => {
      setFiltrosSeleccionados(asegurarFechasValidas(nuevosFiltros));
    };

    return (
      <AdvancedFilterInput
        selectedFilters={filtrosSeleccionados}
        onFiltersChange={manejarCambioFiltros}
        onSearch={manejarBusqueda}
        filterScheme={mockChannelViewFilterSchemeResponse.scheme}
        sources={fuentesExtendidas}
      />
    );
  },
};

/**
 * Función auxiliar para asegurar que las fechas estén correctamente formateadas
 * @param filtros - Array de filtros a procesar
 * @returns Array de filtros con fechas en formato ISO
 */
const asegurarFechasValidas = (filtros) => {
  return filtros.map((filtro) => {
    const fuente = mockChannelViewFilterSchemeResponse.sources.find(
      (s) => s.source === filtro.source
    );
    if (!fuente) return filtro;

    const campo = fuente.fields[filtro.field];
    if (!campo) return filtro;

    const tipoDato =
      mockChannelViewFilterSchemeResponse.scheme.data_types[campo.data_type];
    if (!tipoDato || tipoDato.primitive !== "date") return filtro;

    // Asegurar que los valores de fecha sean cadenas ISO válidas
    return {
      ...filtro,
      value: new Date(filtro.value).toISOString(),
    };
  });
};
