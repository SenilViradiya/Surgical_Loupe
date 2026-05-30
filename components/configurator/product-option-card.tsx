"use client";

import React, { ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  isActive?: boolean;
  disabledReason?: string;
}

export function ProductOptionCard({ children, isActive, disabledReason, className = "", ...rest }: Props) {
  const base =
    "group relative flex flex-col items-start text-left rounded-2xl border bg-white p-3 shadow-sm transition-transform duration-300 will-change-transform";
  const isDisabled = Boolean(rest.disabled || disabledReason);

  const active = isActive
    ? "ring-2 ring-slate-900/10 transform -translate-y-1 shadow-lg"
    : "hover:-translate-y-0.5 hover:shadow-md";

  const disabled = isDisabled
    ? "cursor-not-allowed opacity-45 grayscale-[0.1] hover:translate-y-0 hover:shadow-sm"
    : "";

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      title={disabledReason ?? rest.title}
      className={`${base} ${active} ${disabled} border-slate-200/80 ${className}`}
    >
      {children}
    </button>
  );
}

export default ProductOptionCard;
