"use client";

import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  className?: string;
}

export function ViewerToolbar({
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  isFullscreen,
  className,
}: Props) {
  return (
    <div className={cn("absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 p-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.7)] backdrop-blur-xl transition-all duration-300", isFullscreen && "right-3 top-16 sm:right-6 sm:top-6", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom out"
        onClick={onZoomOut}
        className="rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
      >
        <Minus className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Reset view"
        onClick={onReset}
        className="rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
      >
        <RotateCcw className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom in"
        onClick={onZoomIn}
        className="rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
      >
        <Plus className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        onClick={onToggleFullscreen}
        className="rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
      >
        {isFullscreen ? <X className="size-4" /> : <Maximize2 className="size-4" />}
      </Button>
    </div>
  );
}

export default ViewerToolbar;
