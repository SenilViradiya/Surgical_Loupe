"use client";

export function ViewerToolbar() {
  return (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
      <button
        type="button"
        title="Reset view"
        className="rounded-full bg-white/80 p-2 text-sm shadow-sm"
      >
        Reset
      </button>

      <button
        type="button"
        title="Fullscreen"
        className="rounded-full bg-white/80 p-2 text-sm shadow-sm"
      >
        ⤢
      </button>
    </div>
  );
}

export default ViewerToolbar;
