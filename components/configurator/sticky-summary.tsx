"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function StickySummary({ children }: Props) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#11141A]/95 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] backdrop-blur transition-shadow hover:shadow-[0_32px_80px_-34px_rgba(0,0,0,0.6)]">
      <div className="sticky top-6 space-y-4">
        {children}
      </div>
    </div>

  );
}

export default StickySummary;
