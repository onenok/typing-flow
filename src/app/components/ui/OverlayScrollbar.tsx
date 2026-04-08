"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function OverlayScrollbar({ 
  children, 
  className = "" 
}: Props) {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          theme: "os-theme-dark",
        },
      }}
      className={`h-full w-full overflow-hidden ${className}`}
      style={{ height: "100dvh", width: "100%" }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}