"use client"

import { CBSTContextProps } from "@/types/context/cbst-types"
import { createContext, useContext } from "react"
 

const CBSTContext = createContext<CBSTContextProps | undefined>(undefined)

export const useCBSTContext = () => {
  const context = useContext(CBSTContext)
  if (!context) {
    throw new Error("useCBSTContext must be used within a CBSTProvider")
  }
  return context
}

export { CBSTContext }

