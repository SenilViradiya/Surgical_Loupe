"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function CustomInput({
  label,
  error,
  className,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <Input
        className={cn(error && "border-red-500", className)}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
