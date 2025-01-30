import type {

  ChannelViewFilterSchemeResponse,
  Filter,
  FilterScheme,
  Source,
} from "../types/components/custom-advanced-input-filter.type";

// Filtros
export const mockFilters: Filter[] = [
  {
    source: "ContaDebinARSCoelsa",
    field: "[tipomov]",
    operator: "eq",
    value: "value1",
  },
  {
    source: "ContaDebinARSGalicia",
    field: "[importe]",
    operator: "gt",
    value: "12.75",
  },
  {
    source: "ContaDebinARSCoelsa",
    field: "[fecha-movimiento]",
    operator: "eq",
    value: "31-01-2025",
  },
  {
    source: "ContaDebinARSCoelsa",
    field: "[horario-movimiento]",
    operator: "between",
    value: "{\"from\": \"12:00:00\", \"to\": \"13:00:00\"}",
  },
  {
    source: "ContaDebinARSCoelsa",
    field: "[fecha-movimiento]",
    operator: "between",
    value: "{\"from\":\"01-01-2025\",\"to\":\"15-01-2025\"}"
  },
  {
    source: "*",
    field: "*",
    operator: "contains",
    value: "pepe",
  },
];

// Esquema
export const mockFilterScheme: FilterScheme = {
  data_types: {
    "combo-tipo-mov": {
      primitive: "string",
      scope: "option",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
      },
      options: {
        trxin: "TRXIN",
        casho: "CASHO - Efectivo",
        debinqr: "DEBINQR - Bonos",
        pepe: "PEPE <sin definir>",
      },
    },
    texto: {
      primitive: "string",
      scope: "text",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        like: { expression: "like", display: "contiene" },
        not_like: { expression: "not like", display: "no contiene" },
        starts_with: { expression: "starts with", display: "empieza con" },
        ends_with: { expression: "ends with", display: "termina con" },
        is_empty: { expression: "is empty", display: "está vacío" },
        is_not_empty: { expression: "is not empty", display: "no está vacío" },
      },
    },
    number: {
      primitive: "number",
      scope: "number",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        between: { expression: "between", display: "está entre", range: true },
        not_between: { expression: "not between", display: "no está entre", range: true },
      },
    },
    "number-nullable": {
      primitive: "number",
      scope: "number",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        is_null: { expression: "is null", display: "es nulo" },
        is_not_null: { expression: "is not null", display: "no es nulo" },
        between: { expression: "between", display: "está entre", range: true },
        not_between: { expression: "not between", display: "no está entre", range: true },
      },
    },
    fecha: {
      primitive: "string",
      scope: "date",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        between: { expression: "between", display: "está entre", range: true },
        not_between: { expression: "not between", display: "no está entre", range: true },
      },
    },
    horario: {
      primitive: "string",
      scope: "time",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
        gt: { expression: ">", display: "es mayor que" },
        lt: { expression: "<", display: "es menor que" },
        gte: { expression: ">=", display: "es mayor o igual que" },
        lte: { expression: "<=", display: "es menor o igual que" },
        between: { expression: "between", display: "está entre", range: true },
        not_between: { expression: "not between", display: "no está entre", range: true },
      },
    },
    cbu: {
      primitive: "string",
      scope: "text",
      filtering_operators: {
        eq: { expression: "==", display: "es igual a" },
        ne: { expression: "!=", display: "es diferente de" },
      },
    },
  },
};

// Fuentes
export const mockSources: Source[] = [
  {
    source: "ContaDebinARSCoelsa",
    display: "Coelsa",
    fields: {
      "[tipomov]": {
        display: "Tipo Movimiento",
        data_type: "combo-tipo-mov",
        filteringTips: [
          { tip: "Tipo Movimiento en Coelsa es igual a TRXIN", filtering_operator: "eq" },
        ],
      },
      "[fecha-movimiento]": {
        display: "Fecha de movimiento",
        data_type: "fecha",
        filteringTips: [
          { tip: "Fecha de movimiento en Coelsa es igual a", filtering_operator: "eq" },
        ],
      },
      "[horario-movimiento]": {
        display: "Hora de movimiento",
        data_type: "horario",
        filteringTips: [
          { tip: "Hora de movimiento en Coelsa está entre", filtering_operator: "between" },
        ],
      },
      "[importe]": {
        display: "Importe",
        data_type: "number-nullable",
        filteringTips: [
          { tip: "Importe en Coelsa es mayor a", filtering_operator: "gt" },
        ],
      },
      "[cvu2]": {
        display: "CVU 2",
        data_type: "cbu",
        filteringTips: [
          { tip: "CVU 2 es igual a", filtering_operator: "eq" },
        ],
      },
    },
  },
  {
    source: "ContaDebinARSGalicia",
    display: "Galicia",
    fields: {
      "[importe]": {
        display: "Importe",
        data_type: "number",
        filteringTips: [
          { tip: "Importe en Galicia es mayor a", filtering_operator: "gt" },
        ],
      },
      "[fecha-movimiento]": {
        display: "Fecha de movimiento",
        data_type: "fecha",
        filteringTips: [
          { tip: "Fecha de movimiento en Galicia está entre", filtering_operator: "between" },
        ],
      },
      "[titular]": {
        display: "Titular",
        data_type: "texto",
        filteringTips: [
          { tip: "Titular contiene", filtering_operator: "like" },
        ],
      },
    },
  },
];

// Respuesta combinada
export const mockChannelViewFilterSchemeResponse: ChannelViewFilterSchemeResponse = {
  filters: mockFilters,
  scheme: mockFilterScheme,
  sources: mockSources,
};
