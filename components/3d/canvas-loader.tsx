import {
  Html,
} from "@react-three/drei";

export function CanvasLoader() {
  return (
    <Html
      center
      className="pointer-events-none"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white/80 backdrop-blur">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/12" />

        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-white/12" />
          <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </Html>
  );
}
