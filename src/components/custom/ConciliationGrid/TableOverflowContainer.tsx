 
import { useCBSTContext } from "@/context/ui/CBSTContext"
import { JSX } from "react"

interface Props {
  Toolbar: JSX.Element
  Table: JSX.Element
  Pagination: JSX.Element | null
}

export const TableOverflowContainer = ({ Toolbar, Table, Pagination }: Props) => {
  const { footerRef, toolbarRef } = useCBSTContext()

  return (
    <div className="flex flex-col h-full">
      <div ref={toolbarRef} className="flex-shrink-0 bg-white border-b">
        {Toolbar}
      </div>
      <div className="flex-1 min-h-0 overflow-auto">{Table}</div>
      <div ref={footerRef} className="flex-shrink-0 bg-white border-t">
        {Pagination && Pagination}
      </div>
    </div>
  )
}

