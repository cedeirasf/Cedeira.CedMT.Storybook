import { DataType, FilterScheme, RangeValue, Source } from "@/types/components/custom-advanced-input-filter.type"

export const getBaseTip = (tipText: string, operatorDisplay: string) => {
    const index = tipText.toLowerCase().indexOf(operatorDisplay.toLowerCase())
    return index !== -1 ? tipText.slice(0, index).trim() : tipText.trim()
}

export function getDataType(
    source: string,
    field: string,
    sources: Source[],
    filterScheme: FilterScheme,
): DataType | undefined {
    const selectedSource = sources.find((s) => s.source === source)
    const selectedField = selectedSource?.fields[field]
    return selectedField ? filterScheme.data_types[selectedField.data_type] : undefined
}

export function parseRangeValue(value: unknown): RangeValue {
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value)
            return {
                from: String(parsed.from || ""),
                to: String(parsed.to || ""),
            }
        } catch {
            return { from: value, to: "" }
        }
    }
    if (typeof value === "number") {
        return { from: String(value), to: "" }
    }
    if (typeof value === "object" && value !== null) {
        const rangeValue = value as RangeValue
        return {
            from: String(rangeValue.from || ""),
            to: String(rangeValue.to || ""),
        }
    }
    return { from: "", to: "" }
}