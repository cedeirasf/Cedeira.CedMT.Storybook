import type { ConditionalRowFormat } from "@/types/components/custom-table-conciliation-type";

export const adaptRowStyleDictionary = (
  conditionalRowFormat: ConditionalRowFormat[]
): Record<number, string[]> => {
  const rowStyleDictionary: Record<number, string[]> = {};

  conditionalRowFormat.forEach((item) => {
    item["index-rows"].forEach((index) => {
      rowStyleDictionary[index] = item.styles;
    });
  });

  return rowStyleDictionary;
};
