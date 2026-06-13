"use client";

import React, { ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  isActive?: boolean;
  disabledReason?: string;
}

export function ProductOptionCard({ children, isActive, disabledReason, className = "", ...rest }: Props) {
  const base =
    "group relative flex flex-col items-start text-left rounded-2xl border bg-[#11141A] p-3 shadow-sm transition-transform duration-300 will-change-transform";
  const isDisabled = Boolean(rest.disabled || disabledReason);

  const active = isActive
    ? "ring-2 ring-[#C4A25D] transform -translate-y-1 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] border-[#C4A25D]/50"
    : "hover:-translate-y-0.5 hover:shadow-md hover:bg-[#15181F]";

  const disabled = isDisabled
    ? "cursor-not-allowed opacity-45 grayscale-[0.1] hover:translate-y-0 hover:shadow-sm"
    : "";

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      title={disabledReason ?? rest.title}
      className={`${base} ${active} ${disabled} border-white/10 text-[#F4F1EA] ${className}`}
    >

      {children}
    </button>
  );
}

export default ProductOptionCard;
