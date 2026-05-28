"use client";

import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function ViewerToolbar({
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  isFullscreen,
}: Props) {
  return (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 p-2 shadow-lg backdrop-blur">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom out"
        onClick={onZoomOut}
        className="rounded-full text-white hover:bg-white/10 hover:text-white"
      >
        <Minus className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Reset view"
        onClick={onReset}
        className="rounded-full text-white hover:bg-white/10 hover:text-white"
      >
        <RotateCcw className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Zoom in"
        onClick={onZoomIn}
        className="rounded-full text-white hover:bg-white/10 hover:text-white"
      >
        <Plus className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        onClick={onToggleFullscreen}
        className="rounded-full text-white hover:bg-white/10 hover:text-white"
      >
        {isFullscreen ? <X className="size-4" /> : <Maximize2 className="size-4" />}
      </Button>
    </div>
  );
}

export default ViewerToolbar;
