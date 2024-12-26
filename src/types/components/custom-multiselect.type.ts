// Define los tipos específicos para las propiedades del TagFilter
export type TagFilterColor = "neutral" | "green" | "blue" | "red" | "orange" | "yellow" | "violet";
export type TagFilterSize = "sm" | "md" | "lg";
export type TagFilterRounded = "sm" | "md" | "lg" | "full";


export interface MultiSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  values: string[];
  onValuesChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  maxCount?: number;
  placeholder?: string;
  tagStyles?: TagFilterStyleProps;
}

export interface TagFilterStyleProps {
  color?: TagFilterColor;
  size?: TagFilterSize;
  rounded?: TagFilterRounded;
}

export interface MultiSelectContextProps {
  value: string[];
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  maxCount?: number;
  placeholder?: string;
  tagStyles?: TagFilterStyleProps;
}