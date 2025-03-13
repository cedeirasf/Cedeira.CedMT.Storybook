import { v4 as uuidv4 } from "uuid"
import type { Datarow, GridDTO } from "../types/components/custom-table-conciliation-type"

const estadoOptions = [
  { value: "1", display: "CONCILIA", styles: ["text-green-600 bg-green-100", "icon-check"] },
  { value: "2", display: "NO CONCILIA", styles: ["text-red-600 bg-red-100", "icon-x"] },
  { value: "3", display: "NO APLICA", styles: ["text-gray-600 bg-white", "icon-arrow-up-right"] },
  { value: "4", display: "PENDIENTE", styles: ["text-gray-600 bg-gray-100", "icon-clock"] },
  { value: "5", display: "PARA AJUSTAR", styles: ["text-purple-600 bg-purple-100", "icon-alert-circle"] },
  { value: "6", display: "PROCESANDO AJUSTE", styles: ["text-purple-700 bg-purple-200", "icon-loader"] },
  { value: "7", display: "AJUSTADO", styles: ["text-purple-800 bg-purple-300", "icon-check-circle"] },
]

const criterioOptions = [
  {
    value: "B3945840-F35E-4577-9CDF-9E9FD585A651",
    display: "Diferencia de importes",
    styles: ["text-red-600", "icon-unequal"],
  },
  { value: "8A28224E-0862-4E21-BF09-8D0DB23D08F3", display: "Estados distintos 3", styles: ["icon-git-branch"] },
  { value: "CCFCE754-DE45-4541-9A5F-2DC2B206FC7D", display: "Solo Galicia en S/P", styles: ["icon-file-question"] },
  { value: "11E97A98-0C2C-40F6-BFFA-9B3D127B7AB2", display: "Faltantes en Galicia", styles: ["icon-file-x"] },
  { value: "671FA03F-04B9-4319-B1CF-123EC94C4DEB", display: "Estados iguales", styles: ["icon-check-circle-2"] },
]

const tipoObjetoOptions = [
  { value: "CASHO", display: "(CASHO) CASHOUT", styles: ["icon-wallet"] },
  { value: "COMAD", display: "(COMAD) COMISION ADQUIRENTE", styles: ["icon-percent"] },
  { value: "COMBI", display: "(COMBI) COMISION BILLETERA", styles: ["icon-credit-card"] },
  { value: "DEBIN", display: "(DEBIN)", styles: ["icon-banknote"] },
  { value: "TRXIN", display: "(TRXIN) TRANSFERENCIA", styles: ["icon-repeat"] },
]

// Define the updating rows scheme
const updatingRowsScheme = {
  NEW: {
    style: ["bg-green-100 dark:bg-green-900"],
    delay: "duration-500 	transition-duration: initial",
  },
  UPDATED: {
    style: ["bg-yellow-100 dark:bg-yellow-900"],
    delay: "duration-500 	transition-duration: initial",
  },
  NONE: {
    style: [],
    delay: "duration-500 	transition-duration: initial",
  },
}

// Helper function to generate a random update type
const generateUpdateType = (): "NEW" | "UPDATED" | "NONE" => {
  const types: ("NEW" | "UPDATED" | "NONE")[] = ["NEW", "UPDATED", "NONE"]
  const weights = [0.1, 0.2, 0.7] // 10% NEW, 20% UPDATED, 70% NONE
  const random = Math.random()
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random < sum) {
      return types[i]
    }
  }
  return "NONE"
}

// Generate updating rows array
const generateUpdatingRows = (count: number) => {
  return Array(count)
    .fill(null)
    .map(() => ({
      type: generateUpdateType(),
    }))
}

export const generateRow = (index: number): Datarow => ({
  "[UUID]": uuidv4(),
  "[UUIDEstadoConciliacion]": estadoOptions[Math.floor(Math.random() * estadoOptions.length)].value,
  "[UUIDCriterioConciliacion]": criterioOptions[Math.floor(Math.random() * criterioOptions.length)].value,
  "[Completado]": ["S", "N", "P"][Math.floor(Math.random() * 3)],
  "[TipoObjeto]": tipoObjetoOptions[Math.floor(Math.random() * tipoObjetoOptions.length)].value,
  "[IdObjeto]": `ID-${index + 1}`,
  "[TipoMov]": Math.random() > 0.5 ? "C" : "D",
  "[FechaHoraMov]": new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  "[Importe]": (Math.random() * 1000000).toFixed(2),
  "[ContaDebinARSCoelsaId]": String(Math.floor(Math.random() * 1000000)),
  "[ContaDebinARSGaliciaId]": String(Math.floor(Math.random() * 1000000)),
  "[FuenteId]": String(Math.floor(Math.random() * 1000000)),
})

const fullDataset = Array.from({ length: 198 }, (_, i) => generateRow(i))

export const mockData: GridDTO = {
  view: "conciliaciones",
  pagination: {
    total: 198,
    page: 1,
    pages: 20,
    rows: 10,
  },
  behaviors: {
    exportable: true,
  },
  sources: [
    {
      source: "[Conciliaciones]",
      display: "Conciliaciones",
      behaviors: { isSticky: true },
      body: {
        scheme: {
          "[UUID]": {
            display: "UUID",
            data_type: { primitive: "string" },
            behaviors: { sortable: true, visible: false },
          },
          "[UUIDEstadoConciliacion]": {
            display: "Estado",
            data_type: {
              primitive: "string",
              styles: ["text-center"],
              options: estadoOptions,
            },
            behaviors: { sortable: true, visible: true },
          },
          "[UUIDCriterioConciliacion]": {
            display: "Criterios de conciliación",
            data_type: {
              primitive: "string",
              styles: ["text-gray-600"],
              options: criterioOptions,
            },
            behaviors: { sortable: true, visible: true },
          },
        },
        datarows: fullDataset.slice(0, 10),
      },
      footer: {},
    },
    {
      source: "[ContaDebinARSCoelsa]",
      display: "Coelsa",
      behaviors: { isSticky: false },
      body: {
        scheme: {
          "[Completado]": {
            display: "Completado",
            data_type: {
              primitive: "string",
              options: [
                { value: "S", display: "Si", styles: ["text-green-600 bg-green-100", "icon-check"] },
                { value: "N", display: "No", styles: ["text-red-600 bg-red-100", "icon-x"] },
                { value: "P", display: "Pendiente", styles: ["text-gray-600 bg-gray-100", "icon-clock"] },
              ],
            },
            behaviors: { sortable: true, visible: true },
          },
          "[TipoObjeto]": {
            display: "Tipo Objeto",
            data_type: {
              primitive: "string",
              options: tipoObjetoOptions,
            },
            behaviors: { sortable: true, visible: true },
          },
          "[IdObjeto]": {
            display: "Id Objeto",
            data_type: { primitive: "string" },
            behaviors: { sortable: true, visible: true },
          },
          "[TipoMov]": {
            display: "Tipo de Movimiento",
            data_type: {
              primitive: "string",
              options: [
                { value: "C", display: "CREDITO", styles: ["text-green-600 bg-green-100", "icon-arrow-up-right"] },
                { value: "D", display: "DEBITO", styles: ["text-red-600 bg-red-100", "icon-arrow-down-left"] },
              ],
            },
            behaviors: { sortable: true, visible: true },
          },
          "[FechaHoraMov]": {
            display: "Fecha y Hora de Movimiento",
            data_type: {
              primitive: "datetime",
              format: "dd/MM/yyyy HH:mm:ss",
            },
            behaviors: { sortable: true, visible: true },
          },
          "[Importe]": {
            display: "Importe",
            data_type: {
              primitive: "number",
              format: "currency",
            },
            behaviors: { sortable: true, visible: true },
          },
          "[ContaDebinARSCoelsaId]": {
            display: "ContaDebinARSCoelsaId",
            data_type: { primitive: "number" },
            behaviors: { sortable: true, visible: true },
          },
        },
        datarows: fullDataset.slice(0, 10),
      },
      footer: {},
    },
    {
      source: "[ContaDebinARSGalicia]",
      display: "Galicia",
      behaviors: { isSticky: false },
      body: {
        scheme: {
          "[Completado]": {
            display: "Completado",
            data_type: {
              primitive: "string",
              options: [
                { value: "S", display: "Si", styles: ["text-green-600 bg-green-100"] },
                { value: "N", display: "No", styles: ["text-red-600 bg-red-100"] },
                { value: "P", display: "Pendiente", styles: ["text-gray-600 bg-gray-100"] },
              ],
            },
            behaviors: { sortable: true, visible: true },
          },
          "[TipoObjeto]": {
            display: "Tipo Objeto",
            data_type: {
              primitive: "string",
              options: tipoObjetoOptions,
            },
            behaviors: { sortable: true, visible: true },
          },
          "[IdObjeto]": {
            display: "Id Objeto",
            data_type: { primitive: "string" },
            behaviors: { sortable: true, visible: true },
          },
          "[TipoMov]": {
            display: "Tipo de Movimiento",
            data_type: {
              primitive: "string",
              options: [
                { value: "C", display: "CREDITO", styles: ["text-green-600 bg-green-100", "icon-arrow-up-right"] },
                { value: "D", display: "DEBITO", styles: ["text-red-600 bg-red-100"] },
              ],
            },
            behaviors: { sortable: true, visible: true },
          },
          "[FechaHoraMov]": {
            display: "Fecha y Hora de Movimiento",
            data_type: {
              primitive: "datetime",
              format: "dd/MM/yyyy HH:mm:ss",
            },
            behaviors: { sortable: true, visible: true },
          },
          "[Importe]": {
            display: "Importe",
            data_type: {
              primitive: "number",
              format: "currency",
            },
            behaviors: { sortable: true, visible: true },
          },
          "[ContaDebinARSGaliciaId]": {
            display: "ContaDebinARSGaliciaId",
            data_type: { primitive: "number" },
            behaviors: { sortable: true, visible: true },
          },
          "[FuenteId]": {
            display: "FuenteId",
            data_type: { primitive: "string" },
            behaviors: { sortable: true, visible: true },
          },
        },
        datarows: fullDataset.slice(0, 10),
      },
      footer: {},
    },
  ],
  "conditional-row-format": [
    {
      "index-rows": [1, 2],
      styles: ["bg-red-50"],
    },
    {
      "index-rows": [5],
      styles: ["bg-purple-50"],
    },
  ],
  "updating-rows": {
    scheme: updatingRowsScheme,
    rows: generateUpdatingRows(10),
  },
}

export const generatePaginatedData = (page: number, rowsPerPage: number): GridDTO => {
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  return {
    ...mockData,
    pagination: {
      total: fullDataset.length,
      page,
      pages: Math.ceil(fullDataset.length / rowsPerPage),
      rows: rowsPerPage,
    },
    sources: mockData.sources.map((source) => ({
      ...source,
      body: {
        ...source.body,
        datarows: fullDataset.slice(startIndex, endIndex),
      },
    })),
    "updating-rows": {
      scheme: updatingRowsScheme,
      rows: generateUpdatingRows(rowsPerPage),
    },
  }
}

export const updateRandomRecords = (data: GridDTO, count = 3): { updatedData: GridDTO; updatedRows: Set<number> } => {
  const recordsToUpdate = new Set<number>()
  const totalRecords = data.sources[0].body.datarows.length

  while (recordsToUpdate.size < count) {
    recordsToUpdate.add(Math.floor(Math.random() * totalRecords))
  }

  const updatedData: GridDTO = JSON.parse(JSON.stringify(data))

  // Update the data rows
  recordsToUpdate.forEach((index) => {
    const newRow = generateRow(index)
    updatedData.sources.forEach((source) => {
      source.body.datarows[index] = {
        ...source.body.datarows[index],
        ...newRow,
      }
    })
  })

  // Update the updating-rows status
  if (updatedData["updating-rows"]) {
    const updatingRows = [...updatedData["updating-rows"].rows]

    // First, mark all previously updated rows as NONE
    updatingRows.forEach((row, idx) => {
      if (row.type === "UPDATED" || row.type === "NEW") {
        updatingRows[idx] = { type: "NONE" }
      }
    })

    // Then, mark newly updated rows
    recordsToUpdate.forEach((index) => {
      updatingRows[index] = { type: "UPDATED" }
    })

    updatedData["updating-rows"].rows = updatingRows
  }

  return {
    updatedData,
    updatedRows: recordsToUpdate,
  }
}

