import type { ChannelViewFilterSchemeResponse, FilterScheme, Source } from "../types/components/custom-advanced-input-filter.type"

export const mockFilterScheme: FilterScheme = {
  data_types: {
    "combo-tipo-mov": {
      primitive: "string",
      filtering_operators: {
        eq: {
          expression: "==",
          display: "es igual a",
        },
        ne: {
          expression: "!=",
          display: "es diferente de",
        },
      },
      options: {
        trxin: "TRXIN",
        casho: "CASHO - Efectivo",
        debinqr: "DEBINQR - Bonos",
        pepe: "PEPE <sin definir>",
      },
    },
    cbu: {
      primitive: "string",
      filtering_operators: {
        eq: {
          expression: "==",
          display: "es igual a",
        },
        ne: {
          expression: "!=",
          display: "es diferente de",
        },
      },
    },
    string: {
      primitive: "string",
      filtering_operators: {
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        in: { expression: "in", display: "esta incluido en" },
        nin: { expression: "nin", display: "no esta incluido en" },
        between: { expression: "between", display: "esta entre" },
        not_between: { expression: "not between", display: "no esta entre" },
        like: { expression: "like", display: "contiene" },
        not_like: { expression: "not like", display: "no contiene" },
        is_empty: { expression: "is empty", display: "está vacío" },
        starts_with: { expression: "starts with", display: "empieza con" },
        ends_with: { expression: "ends with", display: "termina con" },
        is_not_empty: { expression: "is not empty", display: "no está vacío" },
        is_null: { expression: "is null", display: "es nulo" },
        is_not_null: { expression: "is not null", display: "no es nulo" },
      },
    },
    number: {
      primitive: "number",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        in: { expression: "in", display: "esta incluido en" },
        nin: { expression: "nin", display: "no esta incluido en" },
        is_empty: { expression: "is empty", display: "está vacío" },
        is_not_empty: { expression: "is not empty", display: "no está vacío" },
      },
    },
    "number-nullable": {
      primitive: "number",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        in: { expression: "in", display: "esta incluido en" },
        nin: { expression: "nin", display: "no esta incluido en" },
        is_empty: { expression: "is empty", display: "está vacío" },
        is_not_empty: { expression: "is not empty", display: "no está vacío" },
        is_null: { expression: "is null", display: "es nulo" },
        is_not_null: { expression: "is not null", display: "no es nulo" },
      },
    },
    "fecha-sin-rango": { // Ver el scheme por que faltaria ver como seria el date tanto para un filtro cargado como para la creacion de uno nuevo
      primitive: "date",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        between: { expression: "between", display: "esta entre" },
        not_between: { expression: "not between", display: "no esta entre" },
        is_null: { expression: "is null", display: "es nulo" },
        is_not_null: { expression: "is not null", display: "no es nulo" },
      },
    },
  },

}

export const mockSources: Source[] = [
  {
    source: "ContaDebinARSCoelsa",
    display: "Coelsa",
    fields: {
      "[column_key_1]": {
        display: "Importe",
        data_type: "number-nullable",
        filteringTips: [
          {
            tip: "Importe en Coelsa es mayor a",
            filtering_operator: "gt",
          },
          {
            tip: "Importe en Coelsa es menor a",
            filtering_operator: "lt",
          },
        ],
      },
      "[cvu2]": {
        display: "CVU 2",
        data_type: "cbu",
        filteringTips: [
          {
            tip: "CVU 2 es igual a",
            filtering_operator: "eq",
          },
          {
            tip: "CVU 2 es distinto a",
            filtering_operator: "ne",
          },
        ],
      },
      "[tipomov]": {
        display: "Tipo Movimiento",
        data_type: "combo-tipo-mov",
        filteringTips: [
          {
            tip: "Tipo Movimiento en Coelsa es igual a TRXIN",
            filtering_operator: "eq",
          },
          {
            tip: "Tipo Movimiento en Coelsa es distinto a DEBINQR - Bonos",
            filtering_operator: "ne",
          },
        ],
      },
    },
  },
  {
    source: "ContaDebinARSGalicia",
    display: "Payment",
    fields: {
      "[column_key_1]": {
        display: "Importe",
        data_type: "number-nullable",
        filteringTips: [
          {
            tip: "Importe en Payment es mayor a",
            filtering_operator: "gt",
          },
          {
            tip: "Importe en Payment es menor a",
            filtering_operator: "lt",
          },
        ],
      },
      "[tipomov]": {
        display: "Tipo Movimiento",
        data_type: "combo-tipo-mov",
        filteringTips: [
          {
            tip: "Tipo Movimiento en Payment es igual a TRXIN",
            filtering_operator: "eq",
          },
          {
            tip: "Tipo Movimiento en Payment es distinto a DEBINQR - Bonos",
            filtering_operator: "ne",
          },
        ],
      },
      // Ejemplo para mostrar calendario field de primitivo date
      "[fecha-sin-rango]": {
        display: "Fecha",
        data_type: "fecha-sin-rango",
        filteringTips: [
          {
            tip: "Fecha en Payment es mayor a",
            filtering_operator: "gt",
          },
          {
            tip: "Fecha en Payment es menor a",
            filtering_operator: "lt",
          },
        ],
      },
    },
  },
]


export const mockChannelViewFilterSchemeResponse: ChannelViewFilterSchemeResponse = {
  filters: [
    {
      source: "ContaDebinARSCoelsa",
      field: "[tipomov]",
      operator: "eq",
      value: "trxin",
    },
    {
      source: "ContaDebinARSGalicia",
      field: "[column_key_1]",
      operator: "gt",
      value: "12.75",
    },
    {
      source: "*",
      field: "*",
      operator: "contains",
      value: "pepe",
    },
    //Caso que venga un filtro con un campo de tipo date
    {
      source: "ContaDebinARSGalicia",
      field: "[fecha-sin-rango]",
      operator: "gt",
      value: "2022-01-01", // Formato fecha hora y minuto YYYY-MM-DDTHH:MM:SS agregar la hora despues de la fecha
    },
  ],
  scheme: mockFilterScheme,
  sources: mockSources
}

