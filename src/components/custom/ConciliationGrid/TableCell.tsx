"use client";

import React from "react";
import { memo, useMemo } from "react";
import type { SchemeColumn } from "@/types/components/custom-table-conciliation-type";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { extractIconName, getLucideIcon } from "@/lib/styles-utils";

interface TableCellProps {
  columnKey: string;
  column: SchemeColumn;
  value: string | number | null;
  isUpdated?: boolean;
}

const hasBgStyle = (styles?: readonly string[]): boolean => {
  return (
    styles?.some(
      (style) => style.includes("bg-") || style.includes("background")
    ) ?? false
  );
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

export const TableCell: React.FC<TableCellProps> = memo(
  ({ columnKey, column, value, isUpdated = false }) => {
    const renderCellContent = useMemo(() => {
      if (value === null || value === undefined) {
        return "-";
      }

      // Si hay opciones definidas, buscar el display correspondiente
      if (column.data_type.options) {
        const option = column.data_type.options.find(
          (opt) => opt.value === value
        );
        if (option) {
          // Extraer el icono si existe
          let Icon: LucideIcon | null = null;
          if (option.styles) {
            const iconName = extractIconName(option.styles);
            if (iconName) {
              Icon = getLucideIcon(iconName) as LucideIcon;
            }
          }

          const content = (
            <>
              {Icon && <Icon className="h-4 w-4" />}
              <span>{option.display}</span>
            </>
          );

          // Siempre usar Badge si hay estilos de fondo
          if (hasBgStyle(option.styles)) {
            return (
              <Badge
                className={cn(
                  "inline-flex items-center gap-2 font-medium",
                  option.styles
                )}
              >
                {content}
              </Badge>
            );
          }

          // Si no hay estilos de fondo, usar div con los estilos
          return (
            <div
              className={cn("inline-flex items-center gap-2", option.styles)}
            >
              {content}
            </div>
          );
        }
      }

      // Formatear valor según el tipo
      let formattedValue: string = value.toString();
      if (
        column.data_type.primitive === "number" &&
        column.data_type.format === "currency"
      ) {
        formattedValue = formatCurrency(Number(value));
      }

      // Si la columna tiene estilos con fondo, usar Badge
      if (hasBgStyle(column.data_type.styles)) {
        return (
          <Badge
            className={cn(
              "inline-flex items-center gap-2 font-medium",
              column.data_type.styles
            )}
          >
            {formattedValue}
          </Badge>
        );
      }

      // Si no hay estilos de fondo, usar span con los estilos
      return (
        <span className={cn(column.data_type.styles)}>{formattedValue}</span>
      );
    }, [column, value]);

    return (
      <div
        className={cn(
          "flex items-center",
          isUpdated && "bg-yellow-200 transition-colors duration-500"
        )}
        data-column-key={columnKey}
      >
        {renderCellContent}
      </div>
    );
  }
);

TableCell.displayName = "TableCell";
