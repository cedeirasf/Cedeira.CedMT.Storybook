export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectOptions = SelectOption[];

export interface ICustomSelect {
  options: SelectOptions;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
