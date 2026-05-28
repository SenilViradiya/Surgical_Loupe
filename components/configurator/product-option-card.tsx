"use client";

import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}

export function ProductOptionCard({ children, className }: Props) {
  return (
    <div className={`group rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm ${className ?? ""}`}>
      {children}
    </div>
  );
}

export default ProductOptionCard;
