import React, { JSX } from "react";

interface Props {
  Toolbar?: JSX.Element;
  Table: JSX.Element;
  Pagination: JSX.Element | null;
}

export const TableOverflowContainer = ({
  Toolbar,
  Table,
  Pagination,
}: Props) => {
  // const { footerRef, toolbarRef } = useCBSTContext();

  return (
    <div className="flex flex-col h-full">
      {Toolbar && (
        <div
          // ref={toolbarRef}
          className="flex-shrink-0 border-b"
        >
          {Toolbar}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">{Table}</div>
      {Pagination && (
        <div
          // ref={footerRef}
          className="flex-shrink-0 border-t"
        >
          {Pagination}
        </div>
      )}
    </div>
  );
};
