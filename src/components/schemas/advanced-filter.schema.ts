import { z } from "zod"

export const timeSchema = z
  .object({
    hours: z.number(),
    minutes: z.number(),
    seconds: z.number(),
    period: z.enum(["AM", "PM"]).optional(),
  })
  .nullable()

export const rangeValueSchema = z.object({
  from: z.string().min(1, "El valor 'desde' es requerido"),
  to: z.string().min(1, "El valor 'hasta' es requerido"),
})

// Actualizamos el schema para validar que el value no esté vacío
export const filterFormSchema = z.object({
  source: z.string().min(1, "Seleccione una fuente"),
  field: z.string().min(1, "Seleccione un campo"),
  operator: z.string().min(1, "Seleccione un operador"),
  value: z
    .union([
      // String no vacío
      z
        .string()
        .min(1, "El valor es requerido"),
      // Número válido
      z.number(),
      // Objeto de rango con validación
      rangeValueSchema,
    ])
    .refine(
      (val) => {
        // Validación adicional para asegurar que no sea un objeto vacío o inválido
        if (typeof val === "object" && val !== null) {
          return val.from && val.to
        }
        // Para string y number, aseguramos que no sea vacío
        return val !== undefined && val !== null && val !== ""
      },
      {
        message: "El valor es requerido",
      },
    ),
})