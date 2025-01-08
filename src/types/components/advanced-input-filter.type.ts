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

export interface FilterFormData {
  source: string;
  field: string;
  operator: string;
  value: string;
}

