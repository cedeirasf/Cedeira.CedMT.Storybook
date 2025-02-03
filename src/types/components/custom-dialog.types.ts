export interface ICustomDialog {
  isOpen?: boolean;
  onClose: () => void;
  closeOnClickOutside?: boolean;
  backdropOpacity?: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  disableEscapeKeyDown?: boolean;
}
