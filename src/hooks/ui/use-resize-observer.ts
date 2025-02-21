"use client"

import { useEffect, type RefObject } from "react"

export const useResizeObserver = (elementRef: RefObject<HTMLElement>, callback: (height: number) => void) => {
  useEffect(() => {
    if (!elementRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        callback(entries[0].contentRect.height)
      }
    })

    resizeObserver.observe(elementRef.current)
    return () => resizeObserver.disconnect()
  }, [elementRef, callback])
}

