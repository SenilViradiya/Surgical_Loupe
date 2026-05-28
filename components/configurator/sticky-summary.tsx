"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function StickySummary({ children }: Props) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/95 p-5 shadow-lg">
      {children}
    </div>
  );
}

export default StickySummary;
