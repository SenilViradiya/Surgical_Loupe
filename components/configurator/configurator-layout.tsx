"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  aside?: ReactNode;
}

export function ConfiguratorLayout({
  children,
  aside,
}: Props) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">{children}</main>

        <aside className="lg:col-span-4">
          <div className="sticky top-24">{aside}</div>
        </aside>
      </div>
    </div>
  );
}

export default ConfiguratorLayout;
