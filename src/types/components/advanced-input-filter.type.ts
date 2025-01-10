import { z } from 'zod'

export type FilterType = 'text' | 'number' | 'date' | 'select';

export interface Field {
  id: string;
  label: string;
  type: FilterType;
  operators: string[];
}

export interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
  source?: string;
  field?: string;
  operator?: string;
  value?: string | number | Date;
}

export const filterFormSchema = z.object({
  source: z.string().min(1, "Origen es requerido"),
  field: z.string().min(1, "Campo es requerido"),
  operator: z.string().min(1, "Operador es requerido"),
  value: z.string().optional(),
})

export type FilterFormData = z.infer<typeof filterFormSchema>

