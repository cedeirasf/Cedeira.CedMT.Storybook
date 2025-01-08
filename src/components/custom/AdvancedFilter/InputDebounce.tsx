import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { Loader2, Search } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

type InputSize = 'small' | 'medium' | 'large'

interface InputDebounceProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onSearch: (query: string) => Promise<void>
  isLoading?: boolean
  delay?: number
  size?: InputSize
}

export const InputDebounce = React.forwardRef<HTMLInputElement, InputDebounceProps>(
  ({ onSearch, isLoading = false, delay = 300, value, onChange, className, size = 'medium', ...props }, ref) => {
    const [query, setQuery] = useState(value || '')
    const debouncedQuery = useDebounce(query, delay)

    useEffect(() => {
      setQuery(value || '')
    }, [value])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      onChange?.(e)
    }, [onChange])

    useEffect(() => {
      onSearch(debouncedQuery as string)
    }, [debouncedQuery, onSearch])

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={query}
          onChange={handleChange}
          className={`pl-9 ${className}`}
          size={size}
          {...props}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    )
  }
)
InputDebounce.displayName = 'InputDebounce'

