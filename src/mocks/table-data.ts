import type {
  Datarow,
  GridDTO,
} from "@/types/components/custom-table-conciliation-type";
import { v4 as uuidv4 } from "uuid";
/* Mock del JSON DTO  */
/*  export const mockData: GridDTO = {
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
      behaviors: {
        isSticky: true,
      },
      body: {
        scheme: {
          "[UUID]": {
            display: "UUID",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: false,
            },
          },
          "[UUIDEstadoConciliacion]": {
            display: "Estado",
            data_type: {
              primitive: "string",
              styles: ['text-center'],
              options: [
                { value: "1", display: "CONCILIA", styles: ["text-green-600  bg-green-100"] },
                { value: "2", display: "NO CONCILIA", styles: ["text-red-600 bg-red-100"] },
                { value: "3", display: "NO APLICA", styles: ["text-gray-600 bg-white"] },
                { value: "4", display: "PENDIENTE", styles: ["text-gray-600 bg-gray-100"] },
                { value: "5", display: "PARA AJUSTAR", styles: ["text-purple-600 bg-purple-100"] },
                { value: "6", display: "PROCESANDO AJUSTE", styles: ["text-purple-700 bg-purple-200"] },
                { value: "7", display: "AJUSTADO", styles: ["text-purple-800 bg-purple-300"] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[UUIDCriterioConciliacion]": {
            display: "Criterios de conciliación",
            data_type: {
              primitive: "string",
              styles: ["text-gray-600"],
              options: [
                {
                  value: "B3945840-F35E-4577-9CDF-9E9FD585A651",
                  display: "Diferencia de importes",
                  styles: ["text-red-600"],
                },
                {
                  value: "8A28224E-0862-4E21-BF09-8D0DB23D08F3",
                  display: "Estados distintos 3",
                  styles: [],
                },
                {
                  value: "CCFCE754-DE45-4541-9A5F-2DC2B206FC7D",
                  display: "Solo Galicia en S/P",
                  styles: [],
                },
                {
                  value: "11E97A98-0C2C-40F6-BFFA-9B3D127B7AB2",
                  display: "Faltantes en Galicia",
                  styles: [],
                },
                {
                  value: "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
                  display: "Estados iguales",
                  styles: [],
                },
                {
                  value: "4EB74A2D-138C-4CB9-8D87-01C8DD99055F",
                  display: "Estados distintos 1",
                  styles: [],
                },
                {
                  value: "377B88AE-2C5C-4A55-988A-C545E5A1CD11",
                  display: "Estados distintos 2",
                  styles: [],
                },
                {
                  value: "7CFDDDD8-4727-4194-B1FD-47201979714D",
                  display: "Solo Galicia Pendiente de Ajuste",
                  styles: ["text-blue-700"],
                },
                {
                  value: "1872B96D-66FC-4851-8B5C-EE2CB0EDF50D",
                  display: "Solo Galicia en N",
                  styles: [],
                },
                {
                  value: "E5007DAD-5974-4FF4-A727-3DE5C3C2A2D7",
                  display: "Solo Coelsa en S",
                  styles: [],
                },
                {
                  value: "F64B4EB4-5AC3-4FB6-A260-7078EA638EB0",
                  display: "Solo Coelsa en N",
                  styles: [],
                },
                {
                  value: "B47248F7-FE5D-4972-8565-80384C378945",
                  display: "Duplicados en Coelsa",
                  styles: ["text-purple-600"],
                },
                {
                  value: "5C14010A-B918-4AE4-A351-0619268F7268",
                  display: "Duplicados en Galicia",
                  styles: ["text-purple-600"],
                },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
        },
        datarows: [
          {
            "[UUID]": "B29E62FB-83F9-4C81-9266-F27492004027",
            "[UUIDEstadoConciliacion]": "2",
            "[UUIDCriterioConciliacion]": "B3945840-F35E-4577-9CDF-9E9FD585A651",
          },
          {
            "[UUID]": "00FBCD96-ADE7-4125-8348-47DEB1DB705C",
            "[UUIDEstadoConciliacion]": "2",
            "[UUIDCriterioConciliacion]": "B3945840-F35E-4577-9CDF-9E9FD585A651",
          },
          {
            "[UUID]": "04685344-8EE6-4C6F-88AA-17FB783F11A8",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "2E06BF5D-7954-429C-A656-3504F728A9F6",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "2BA3955C-0286-4725-98FC-6086D56FBAF5",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "4546B615-617C-4E95-8242-072D3098ADC0",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "F6EC9ABA-5661-423E-9B25-0B767759A1E1",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "32A196F0-B508-49F8-A6D6-708CF71C99F4",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "C8CB804F-92E1-4C75-98AF-6F158E285409",
            "[UUIDEstadoConciliacion]": "5",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
          {
            "[UUID]": "295EA913-64DB-4165-8C57-960017866265",
            "[UUIDEstadoConciliacion]": "1",
            "[UUIDCriterioConciliacion]": "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
          },
        ],
      },
      footer: {},
    },
    {
      source: "[ContaDebinARSCoelsa]",
      display: "Coelsa",
      behaviors: {
        isSticky: false,
      },
      body: {
        scheme: {
          "[Completado]": {
            display: "Completado",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "S", display: "Si", styles: ["text-green-600 bg-green-100"] },
                { value: "N", display: "No", styles: ["text-red-600 bg-red-100"] },
                { value: "P", display: "Pendiente", styles: ["text-gray-600 bg-gray-100"] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[TipoObjeto]": {
            display: "Tipo Objeto",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "CASHO", display: "(CASHO) CASHOUT", styles: [] },
                { value: "COMAD", display: "(COMAD) COMISION ADQUIRENTE", styles: [] },
                { value: "COMBI", display: "(COMBI) COMISION BILLETERA", styles: [] },
                { value: "COMCO", display: "(COMCO) COMSION COELSA", styles: [] },
                { value: "CONCA", display: "(CONCA) CONTRACARGO DEBIN PREAUTORIZADO", styles: [] },
                { value: "CONQR", display: "(CONQR) CONTRACARGO QR", styles: [] },
                { value: "DEBIN", display: "(DEBIN)", styles: [] },
                { value: "DEBQR", display: "(DEBQR) DEBIN QR", styles: [] },
                { value: "DEVCA", display: "(DEVCA) DEVOLUCION COMISION ADQUIRENTE", styles: [] },
                { value: "DEVCB", display: "(DEVCB) DEVOLUCION COMISION BILLETERA", styles: [] },
                { value: "DEVCO", display: "(DEVCO) DEVOLUSION COMISION COELSA", styles: [] },
                { value: "DEVOL", display: "(DEVOL) DEVOLUCION DE TRANSFERENCIA O CASHOUT", styles: [] },
                { value: "DEVRE", display: "(DEVRE) DEVOLUCION RESCATE COMISION COELSA", styles: [] },
                { value: "FEPDI", display: "(FEPDI) FACTURA ELECTRONICA - PAGO DIRECTO INMEDIATO", styles: [] },
                { value: "PREAU", display: "(PREAU) DEBIN PREAUTORIZADO", styles: [] },
                { value: "RESCO", display: "(RESCO) RESCATE COMISION COELSA", styles: [] },
                { value: "TRXIN", display: "(TRXIN) TRANSFERENCIA", styles: [] },
                { value: "TRXPL", display: "(TRXPL)", styles: [] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[IdObjeto]": {
            display: "Id Objeto",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[TipoMov]": {
            display: "Tipo de Movimiento",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "C", display: "CREDITO", styles: ["text-green-600 bg-green-100"] },
                { value: "D", display: "DEBITO", styles: ["text-red-600 bg-red-100"] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[FechaHoraMov]": {
            display: "Fecha y Hora de Movimiento",
            data_type: {
              primitive: "datetime",
              format: "dd/MM/yyyy HH:mm:ss",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[Importe]": {
            display: "Importe",
            data_type: {
              primitive: "number",
              format: "currency",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[ContaDebinARSCoelsaId]": {
            display: "ContaDebinARSCoelsaId",
            data_type: {
              primitive: "number",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
        },
        datarows: [
          {
            "[ContaDebinARSCoelsaId]": "7",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "0V1JXON17Z370671NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 15:35:31.0000000",
            "[Completado]": "S",
            "[Importe]": "400000.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "8",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "0V1JXON17Z3706QVNZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 15:35:33.0000000",
            "[Completado]": "S",
            "[Importe]": "569000.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "2",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "0V1JXON17Z3700X7NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 15:35:12.0000000",
            "[Completado]": "S",
            "[Importe]": "120000.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "3",
            "[TipoObjeto]": "DEBQR",
            "[IdObjeto]": "0V1JXON17Z3701YGNZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 15:35:18.0000000",
            "[Completado]": "S",
            "[Importe]": "17351.20",
          },
          {
            "[ContaDebinARSCoelsaId]": "4",
            "[TipoObjeto]": "DEBQR",
            "[IdObjeto]": "0V1JXON17Z3701YGNZ64EL",
            "[TipoMov]": "D",
            "[FechaHoraMov]": "2024-11-13 15:35:18.0000000",
            "[Completado]": "S",
            "[Importe]": "17520.80",
          },
          {
            "[ContaDebinARSCoelsaId]": "187063",
            "[TipoObjeto]": "CONQR",
            "[IdObjeto]": "67REZ8NP1EY6ZK6P24KVGO",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 14:40:48.0000000",
            "[Completado]": "S",
            "[Importe]": "49.52",
          },
          {
            "[ContaDebinARSCoelsaId]": "10",
            "[TipoObjeto]": "PREAU",
            "[IdObjeto]": "0V1JXON17Z37078PNZ64EL",
            "[TipoMov]": "D",
            "[FechaHoraMov]": "2024-11-13 15:34:42.0000000",
            "[Completado]": "S",
            "[Importe]": "1000.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "11",
            "[TipoObjeto]": "DEBQR",
            "[IdObjeto]": "0V1JXON17Z3707X1NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-13 15:34:47.0000000",
            "[Completado]": "S",
            "[Importe]": "27700.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "14",
            "[TipoObjeto]": "DEBQR",
            "[IdObjeto]": "0V1JXON17Z3708Y7NZ64EL",
            "[TipoMov]": "D",
            "[FechaHoraMov]": "2024-11-13 15:35:04.0000000",
            "[Completado]": "S",
            "[Importe]": "6060.00",
          },
          {
            "[ContaDebinARSCoelsaId]": "312561",
            "[TipoObjeto]": "CONQR",
            "[IdObjeto]": "86VRPQ2GDJGYMKLG2GLY0M",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 17:48:04.0000000",
            "[Completado]": "S",
            "[Importe]": "5347.73",
          },
        ],
      },
      footer: {},
    },
    {
      source: "[ContaDebinARSGalicia]",
      display: "Galicia",
      behaviors: {
        isSticky: false,
      },
      body: {
        scheme: {
          "[Completado]": {
            display: "Completado",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "S", display: "Si", styles: ["text-green-600 bg-green-100"] },
                { value: "N", display: "No", styles: ["text-red-600 bg-red-100"] },
                { value: "P", display: "Pendiente", styles: ["text-gray-600 bg-gray-100"] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[TipoObjeto]": {
            display: "Tipo Objeto",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "CASHO", display: "(CASHO) CASHOUT", styles: [] },
                { value: "TRXIN", display: "(TRXIN) TRANSFERENCIA", styles: [] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[IdObjeto]": {
            display: "Id Objeto",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[TipoMov]": {
            display: "Tipo de Movimiento",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
              options: [
                { value: "C", display: "CREDITO", styles: ["text-green-600 bg-green-100"] },
                { value: "D", display: "DEBITO", styles: ["text-red-600 bg-red-100"] },
              ],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[FechaHoraMov]": {
            display: "Fecha y Hora de Movimiento",
            data_type: {
              primitive: "datetime",
              format: "dd/MM/yyyy HH:mm:ss",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[Importe]": {
            display: "Importe",
            data_type: {
              primitive: "number",
              format: "currency",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[ContaDebinARSGaliciaId]": {
            display: "ContaDebinARSGaliciaId",
            data_type: {
              primitive: "number",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
          "[FuenteId]": {
            display: "FuenteId",
            data_type: {
              primitive: "string",
              format: "",
              styles: [],
            },
            behaviors: {
              sortable: true,
              visible: true,
            },
          },
        },
        datarows: [
          {
            "[ContaDebinARSGaliciaId]": "7",
            "[Completado]": "S",
            "[TipoObjeto]": "TRXIN",
            "[IdObjeto]": "76V4MR2Z1J68ZXGGNDEZOL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "1535.98",
            "[FuenteId]": "7",
          },
          {
            "[ContaDebinARSGaliciaId]": "8",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "RD06ZO9WEZ64WG3195GP7X",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "110000.00",
            "[FuenteId]": "8",
          },
          {
            "[ContaDebinARSGaliciaId]": "2",
            "[Completado]": "S",
            "[TipoObjeto]": "TRXIN",
            "[IdObjeto]": "0V1JXON17Z4R3E33NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "20000.00",
            "[FuenteId]": "2",
          },
          {
            "[ContaDebinARSGaliciaId]": "3",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "0V1JXON17Z4R3EZ3NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "300000.00",
            "[FuenteId]": "3",
          },
          {
            "[ContaDebinARSGaliciaId]": "4",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "0V1JXON17Z4R3EZ3NZ64EL",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "300000.00",
            "[FuenteId]": "4",
          },
          {
            "[ContaDebinARSGaliciaId]": "187063",
            "[Completado]": "P",
            "[TipoObjeto]": "TRXIN",
            "[IdObjeto]": "1LMP68NK6GQ7E4YPNR7OEV",
            "[TipoMov]": "D",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "210000.00",
            "[FuenteId]": "187063",
          },
          {
            "[ContaDebinARSGaliciaId]": "10",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "8D0Q619LY7E3J6OL27JZ5R",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "100000.00",
            "[FuenteId]": "10",
          },
          {
            "[ContaDebinARSGaliciaId]": "11",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "L18MKX9R1W6PO0KO9O6WYV",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "36938.94",
            "[FuenteId]": "11",
          },
          {
            "[ContaDebinARSGaliciaId]": "14",
            "[Completado]": "S",
            "[TipoObjeto]": "CASHO",
            "[IdObjeto]": "7L8GYKNXRV648Y5XNMPRZ5",
            "[TipoMov]": "C",
            "[FechaHoraMov]": "2024-11-12 00:00:00.0000000",
            "[Importe]": "442900.00",
            "[FuenteId]": "14",
          },
          {
            "[ContaDebinARSGaliciaId]": "312561",
            "[Completado]": "P",
            "[TipoObjeto]": "TRXIN",
            "[IdObjeto]": "7L8GYKNXRV8RLJ6PNMPRZ5",
            "[TipoMov]": "D",
            "[FechaHoraMov]": "2024-11-13 00:00:00.0000000",
            "[Importe]": "500000.00",
            "[FuenteId]": "312561",
          },
        ],
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
}
 */

/* Mock de 192 registros */

const estadoOptions = [
  {
    value: "1",
    display: "CONCILIA",
    styles: [
      "text-green-600 bg-green-200/90 dark:bg-green-950/90",
      "icon-check",
    ],
  },
  {
    value: "2",
    display: "NO CONCILIA",
    styles: ["text-red-600 bg-red-100 dark:bg-red-950/90", "icon-x"],
  },
  {
    value: "3",
    display: "NO APLICA",
    styles: [
      "text-rose-400 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400",
      "icon-arrow-up-right",
    ],
  },
  {
    value: "4",
    display: "PENDIENTE",
    styles: [
      "text-gray-600 bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300",
      "icon-clock",
    ],
  },
  {
    value: "5",
    display: "PARA AJUSTAR",
    styles: [
      "text-pink-400 bg-pink-100 dark:bg-pink-700/50 dark:text-pink-400",
      "icon-alert-circle",
    ],
  },
  {
    value: "6",
    display: "PROCESANDO AJUSTE",
    styles: [
      "text-cyan-600 bg-cyan-100 dark:bg-cyan-700/50 dark:text-cyan-400",
      "icon-loader",
    ],
  },
  {
    value: "7",
    display: "AJUSTADO",
    styles: [
      "text-blue-600 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400",
      "icon-check-circle",
    ],
  },
];

const criterioOptions = [
  {
    value: "B3945840-F35E-4577-9CDF-9E9FD585A651",
    display: "Diferencia de importes",
    styles: ["text-red-600", "icon-unequal"],
  },
  {
    value: "8A28224E-0862-4E21-BF09-8D0DB23D08F3",
    display: "Estados distintos 3",
    styles: ["icon-git-branch"],
  },
  {
    value: "CCFCE754-DE45-4541-9A5F-2DC2B206FC7D",
    display: "Solo Galicia en S/P",
    styles: ["icon-file-question"],
  },
  {
    value: "11E97A98-0C2C-40F6-BFFA-9B3D127B7AB2",
    display: "Faltantes en Galicia",
    styles: ["icon-file-x"],
  },
  {
    value: "671FA03F-04B9-4319-B1CF-123EC94C4DEB",
    display: "Estados iguales",
    styles: ["icon-check-circle-2"],
  },
];

const tipoObjetoOptions = [
  { value: "CASHO", display: "(CASHO) CASHOUT", styles: ["icon-wallet"] },
  {
    value: "COMAD",
    display: "(COMAD) COMISION ADQUIRENTE",
    styles: ["icon-percent"],
  },
  {
    value: "COMBI",
    display: "(COMBI) COMISION BILLETERA",
    styles: ["icon-credit-card"],
  },
  { value: "DEBIN", display: "(DEBIN)", styles: ["icon-banknote"] },
  { value: "TRXIN", display: "(TRXIN) TRANSFERENCIA", styles: ["icon-repeat"] },
];

const generateRow = (index: number): Datarow => ({
  "[UUID]": uuidv4(),
  "[UUIDEstadoConciliacion]":
    estadoOptions[Math.floor(Math.random() * estadoOptions.length)].value,
  "[UUIDCriterioConciliacion]":
    criterioOptions[Math.floor(Math.random() * criterioOptions.length)].value,
  "[Completado]": ["S", "N", "P"][Math.floor(Math.random() * 3)],
  "[TipoObjeto]":
    tipoObjetoOptions[Math.floor(Math.random() * tipoObjetoOptions.length)]
      .value,
  "[IdObjeto]": `ID-${index + 1}`,
  "[TipoMov]": Math.random() > 0.5 ? "C" : "D",
  "[FechaHoraMov]": new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  "[Importe]": (Math.random() * 1000000).toFixed(2),
  "[ContaDebinARSCoelsaId]": String(Math.floor(Math.random() * 1000000)),
  "[ContaDebinARSGaliciaId]": String(Math.floor(Math.random() * 1000000)),
  "[FuenteId]": String(Math.floor(Math.random() * 1000000)),
});

const fullDataset = Array.from({ length: 198 }, (_, i) => generateRow(i));

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
                {
                  value: "S",
                  display: "Si",
                  styles: [
                    "text-green-600 bg-green-200/90 dark:bg-green-950/90",
                    "icon-check",
                  ],
                },
                {
                  value: "N",
                  display: "No",
                  styles: [
                    "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-950/90",
                    "icon-x",
                  ],
                },
                {
                  value: "P",
                  display: "Pendiente",
                  styles: [
                    "text-gray-600 bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300",
                    "icon-clock",
                  ],
                },
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
                {
                  value: "C",
                  display: "CREDITO",
                  styles: [
                    "text-green-600 bg-green-200/90 dark:bg-green-950/90",
                    "icon-arrow-up-right",
                  ],
                },
                {
                  value: "D",
                  display: "DEBITO",
                  styles: ["text-red-600 bg-red-100", "icon-arrow-down-left"],
                },
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
                {
                  value: "S",
                  display: "Si",
                  styles: [
                    "text-green-600 bg-green-200/90 dark:bg-green-950/90",
                  ],
                },
                {
                  value: "N",
                  display: "No",
                  styles: [
                    "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-950/90",
                  ],
                },
                {
                  value: "P",
                  display: "Pendiente",
                  styles: [
                    "text-gray-600 bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300",
                  ],
                },
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
                {
                  value: "C",
                  display: "CREDITO",
                  styles: [
                    "text-green-600 bg-green-100",
                    "icon-arrow-up-right",
                  ],
                },
                {
                  value: "D",
                  display: "DEBITO",
                  styles: ["text-red-600 bg-red-100"],
                },
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
      styles: ["bg-red-50 dark:bg-red-950/40"],
    },
    {
      "index-rows": [5],
      styles: ["bg-purple-50 dark:bg-purple-950/40"],
    },
  ],
};

export const generatePaginatedData = (
  page: number,
  rowsPerPage: number
): GridDTO => {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

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
  };
};

export const updateRandomRecords = (
  data: GridDTO,
  count = 3
): { updatedData: GridDTO; updatedRows: Set<number> } => {
  const recordsToUpdate = new Set<number>();
  const totalRecords = data.sources[0].body.datarows.length;

  while (recordsToUpdate.size < count) {
    recordsToUpdate.add(Math.floor(Math.random() * totalRecords));
  }

  const updatedData: GridDTO = JSON.parse(JSON.stringify(data));

  recordsToUpdate.forEach((index) => {
    const newRow = generateRow(index);
    updatedData.sources.forEach((source) => {
      source.body.datarows[index] = {
        ...source.body.datarows[index],
        ...newRow,
      };
    });
  });

  return {
    updatedData,
    updatedRows: recordsToUpdate,
  };
};
