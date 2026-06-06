"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
} from "@react-three/drei";
import {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { PerspectiveCamera } from "three";

import { CanvasLoader } from "./canvas-loader";
import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";

import { Model } from "./model";
import ViewerToolbar from "@/components/configurator/viewer-toolbar";

export interface ConfiguratorSceneHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleFullscreen: () => void;
}

interface Props {
  initialFrame?: {
    id: string;
    name: string;
    price: number;
    modelUrl: string;
  };
}

const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 1.15, 8.2];
const DEFAULT_TARGET: [number, number, number] = [0, -0.15, 0];

export const ConfiguratorScene = forwardRef<ConfiguratorSceneHandle, Props>(function ConfiguratorScene(
  {
    initialFrame,
  }: Props,
  ref
) {
  const {
    frame,
    lens,
    headlight,
    setFrame,
  } =
    useConfiguratorStore();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const onModelReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!frame && initialFrame) {
      setFrame(initialFrame);
    }
  }, [frame, initialFrame, setFrame]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const element = wrapperRef.current;



      setIsFullscreen(document.fullscreenElement === element);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const applyCameraTarget = (position: [number, number, number], target: [number, number, number]) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current as unknown as {
      target: { set: (x: number, y: number, z: number) => void };
      update: () => void;
    } | null;

    if (!camera || !controls) return;

    camera.position.set(position[0], position[1], position[2]);
    controls.target.set(target[0], target[1], target[2]);
    controls.update();
  };

  const resetCamera = () => {
    applyCameraTarget(DEFAULT_CAMERA_POSITION, DEFAULT_TARGET);
  };

  const zoomCamera = (delta: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current as unknown as {
      target: { set: (x: number, y: number, z: number) => void };
      update: () => void;
    } | null;

    if (!camera || !controls) return;

    const nextZ = Math.min(11, Math.max(4.5, camera.position.z + delta));
    camera.position.set(camera.position.x, camera.position.y, nextZ);
    controls.update();
  };

  const toggleFullscreen = async () => {

    const element = wrapperRef.current;

    if (!element) return;

    if (document.fullscreenElement === element) {

      await document.exitFullscreen?.().catch(() => undefined);
      setIsFullscreen(false);
      return;
    }



    await element.requestFullscreen?.().catch(() => undefined);


    setIsFullscreen(true);
  };

  useImperativeHandle(ref, () => ({
    resetCamera,
    zoomIn: () => zoomCamera(-0.7),
    zoomOut: () => zoomCamera(0.7),
    toggleFullscreen,
  }));

  return (
    <div
      ref={wrapperRef}
      data-testid={isReady ? "configurator-ready" : "configurator-loading"}
      className={cn(
        "relative overflow-hidden",
        isFullscreen
          ? "fixed inset-0 z-80 h-dvh w-full bg-[linear-gradient(180deg,rgba(2,6,23,0.92)_0%,rgba(7,11,20,0.96)_52%,rgba(2,6,23,0.99)_100%)] p-3 sm:p-6 lg:p-8"
          : "h-88 w-full rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_35%,rgba(12,15,18,0.96)_100%)] shadow-[0_30px_80px_-28px_rgba(15,23,42,0.55)] sm:h-112 sm:rounded-[2rem] lg:h-144 xl:h-168"
      )}
    >
      <div className={cn("relative h-full w-full overflow-hidden", isFullscreen ? "rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_35%,rgba(12,15,18,0.98)_100%)] shadow-[0_40px_120px_-50px_rgba(2,6,23,0.85)] animate-viewer-enter" : "rounded-[inherit]")}>
        {isFullscreen && (
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.12),transparent_28%)]" />
        )}
        <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] tracking-[0.22em] text-white/70 uppercase backdrop-blur sm:left-6 sm:top-6 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
          Live 3D preview
        </div>

        <div className="absolute bottom-3 left-3 z-10 max-w-44 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] leading-4 text-white/70 backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-none sm:px-4 sm:py-3 sm:text-xs">
          Rotate to inspect the fit. The selected frame, lens, and headlight update in real time.
        </div>

        {isFullscreen && (
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur sm:px-6">
            <div className="space-y-1">
              <div className="text-[10px] font-medium tracking-[0.3em] text-white/45 uppercase sm:text-xs">
                Fullscreen viewer
              </div>
              <div className="text-sm text-white/80 sm:text-base">
                Immersive configuration view
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white sm:px-5"
            >
              Close viewer
            </button>
          </div>
        )}

        <ViewerToolbar
          onReset={resetCamera}
          onZoomIn={() => zoomCamera(-0.7)}
          onZoomOut={() => zoomCamera(0.7)}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />

        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          camera={{
            position: DEFAULT_CAMERA_POSITION,
          }}
          className="absolute inset-0"
          onCreated={({ camera }) => {
            cameraRef.current = camera as PerspectiveCamera;
            camera.position.set(...DEFAULT_CAMERA_POSITION);
          }}
          style={{
            transition: "opacity 220ms ease, transform 260ms ease, filter 260ms ease",
          }}
        >
          <color attach="background" args={["#0c1116"]} />
          <fog attach="fog" args={["#0c1116", 8, 24]} />

          <ambientLight intensity={1.45} />

          <directionalLight
            position={[6, 8, 6]}
            intensity={2.1}
            castShadow
          />
          <pointLight
            position={[-4, 3, 3]}
            intensity={1.25}
          />
          <spotLight
            position={[0, 8, 8]}
            angle={0.45}
            penumbra={0.6}
            intensity={1.65}
          />

          <Suspense fallback={<CanvasLoader />}>
            {frame && (
              <Model
                key={frame.modelUrl}
                url={frame.modelUrl}
                scale={1.15}
                position={[0, -1.05, 0]}
              />
            )}

            {lens && (
              <Model
                key={lens.modelUrl}
                url={lens.modelUrl}
                scale={0.6}
                position={[0, 0.05, 0.38]}
              />
            )}

            {headlight && (
              <Model
                key={headlight.modelUrl}
                url={headlight.modelUrl}
                scale={0.42}
                position={[0, 0.55, 0.88]}
              />
            )}
            <mesh
              rotation={[
                -Math.PI / 2,
                0,
                0,
              ]}
              position={[0, -2, 0]}
              receiveShadow
            >
              <planeGeometry
                args={[20, 20]}
              />

              <meshStandardMaterial
                color="#111820"
                roughness={0.95}
                metalness={0.05}
              />
            </mesh>

            {process.env.NEXT_PUBLIC_E2E !== "true" && (
              <Environment preset="city" />
            )}
            <ReadyNotifier onReady={onModelReady} />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.45}
            zoomSpeed={0.55}
            minDistance={4.5}
            maxDistance={11}
            maxPolarAngle={Math.PI / 2}
            target={DEFAULT_TARGET}
          />
        </Canvas>
      </div>
    </div>
  );
});

ConfiguratorScene.displayName = "ConfiguratorScene";

function ReadyNotifier({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}
