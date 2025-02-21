import type { LucideProps, LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

// Definir el tipo específico para los iconos de Lucide
type IconType = (typeof Icons)[keyof typeof Icons]

// Cache para los nombres de iconos convertidos
const iconNameCache = new Map<string, string>()
// Cache para los componentes de iconos
const iconComponentCache = new Map<string, IconType | null>()
// Cache para los estilos limpios
const cleanStylesCache = new Map<string, string[]>()

// Crear un Set para búsqueda rápida de iconos disponibles
const availableIcons = new Set(Object.keys(Icons))

/**
 * Convierte un string de kebab-case a PascalCase
 */
const toPascalCase = (str: string): string => {
  const cached = iconNameCache.get(str)
  if (cached) return cached

  const pascal = str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("")

  iconNameCache.set(str, pascal)
  return pascal
}

/**
 * Extrae el nombre del icono de un array de clases de estilo
 */
export const extractIconName = (styles: readonly string[] = []): string | null => {
  const iconStyle = styles.find((style) => style.startsWith("icon-"))
  return iconStyle ? iconStyle.slice(5) : null
}

/**
 * Verifica si hay estilos de fondo en el array de estilos
 */
export const hasBgStyle = (styles: readonly string[] = []): boolean => {
  return styles.some((style) => style.startsWith("bg-"))
}

/**
 * Limpia las clases de icono del array de estilos
 */
export const cleanStyles = (styles: readonly string[] = []): string[] => {
  const cacheKey = styles.join("|")
  const cached = cleanStylesCache.get(cacheKey)
  if (cached) return cached

  const cleaned = styles.filter((style) => !style.startsWith("icon-"))
  cleanStylesCache.set(cacheKey, cleaned)
  return cleaned
}

/**
 * Obtiene el componente de icono de Lucide basado en su nombre
 */
export const getLucideIcon = (iconName: string): IconType | null => {
  if (!iconName) return null

  const cached = iconComponentCache.get(iconName)
  if (cached !== undefined) return cached

  try {
    const pascalName = toPascalCase(iconName)

    if (!availableIcons.has(pascalName)) {
      iconComponentCache.set(iconName, null)
      return null
    }

    const IconComponent = (Icons as Record<string, IconType>)[pascalName]
    iconComponentCache.set(iconName, IconComponent || null)
    return IconComponent || null
  } catch {
    iconComponentCache.set(iconName, null)
    return null
  }
}

// Exportar tipos necesarios
export type { LucideIcon, LucideProps }
export type LucideIconName = keyof typeof Icons

// Limpiar caches cuando sea necesario
export const clearStyleUtilsCaches = () => {
  iconNameCache.clear()
  iconComponentCache.clear()
  cleanStylesCache.clear()
}

// Definir la interfaz de retorno para processStyles
interface ProcessStylesResult {
  iconName: string | null
  icon: IconType | null
  hasBackground: boolean
  cleanedStyles: string[]
}

/**
 * Optimizador de rendimiento para procesar múltiples estilos a la vez
 */
export const processStyles = (styles: readonly string[] = []): ProcessStylesResult => {
  const iconName = extractIconName(styles)
  const icon = iconName ? getLucideIcon(iconName) : null
  const hasBackground = hasBgStyle(styles)
  const cleanedStyles = cleanStyles(styles)

  return {
    iconName,
    icon,
    hasBackground,
    cleanedStyles,
  }
}

