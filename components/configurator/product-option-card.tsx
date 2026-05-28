"use client";

import React, { ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  isActive?: boolean;
}

export function ProductOptionCard({ children, isActive, className = "", ...rest }: Props) {
  const base =
    "group relative flex flex-col items-start text-left rounded-2xl border bg-white p-3 shadow-sm transition-transform duration-300 will-change-transform";

  const active = isActive
    ? "ring-2 ring-slate-900/10 transform -translate-y-1 shadow-lg"
    : "hover:-translate-y-0.5 hover:shadow-md";

  return (
    <button
      type="button"
      {...rest}
      className={`${base} ${active} border-slate-200/80 ${className}`}
    >
      {children}
    </button>
  );
}

export default ProductOptionCard;
