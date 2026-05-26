"use client";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import {
  Suspense,
  useEffect,
} from "react";

import { CanvasLoader } from "./canvas-loader";

import { useConfiguratorStore } from "@/store/configurator-store";

import { Model } from "./model";

interface Props {
  initialFrame?: {
    id: string;
    name: string;
    price: number;
    modelUrl: string;
  };
}

export function ConfiguratorScene({
  initialFrame,
}: Props) {
  const {
    frame,
    lens,
    headlight,
    setFrame,
  } =
    useConfiguratorStore();

  useEffect(() => {
    if (!frame && initialFrame) {
      setFrame(initialFrame);
    }
  }, [frame, initialFrame, setFrame]);

  return (
    <div className="relative h-[22rem] w-full overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_35%,rgba(12,15,18,0.96)_100%)] shadow-[0_30px_80px_-28px_rgba(15,23,42,0.55)] sm:h-[28rem] sm:rounded-[2rem] lg:h-[36rem] xl:h-[42rem]">
      <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] tracking-[0.22em] text-white/70 uppercase backdrop-blur sm:left-6 sm:top-6 sm:px-3 sm:text-xs sm:tracking-[0.24em]">
        Live 3D preview
      </div>

      <div className="absolute bottom-3 left-3 z-10 max-w-[11rem] rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] leading-4 text-white/70 backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-none sm:px-4 sm:py-3 sm:text-xs">
        Rotate to inspect the fit. The selected frame, lens, and headlight update in real time.
      </div>

      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{
          position: [0, 1.05, 7.5],
        }}
        className="absolute inset-0"
      >
        <color attach="background" args={["#0c1116"]} />
        <fog attach="fog" args={["#0c1116", 10, 24]} />

        <ambientLight intensity={1.8} />

        <directionalLight
          position={[6, 8, 6]}
          intensity={2.4}
          castShadow
        />
        <pointLight
          position={[-4, 3, 3]}
          intensity={1.6}
        />
        <spotLight
          position={[0, 8, 8]}
          angle={0.45}
          penumbra={0.6}
          intensity={2}
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

          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={11}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}