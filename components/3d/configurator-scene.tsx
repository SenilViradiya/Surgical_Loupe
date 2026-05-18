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
  initialFrameUrl?: string;
}

export function ConfiguratorScene({
  initialFrameUrl,
}: Props) {
  const {
    frameUrl,
    setFrame,
  } =
    useConfiguratorStore();

  useEffect(() => {
    if (!frameUrl && initialFrameUrl) {
      setFrame(initialFrameUrl);
    }
  }, [frameUrl, initialFrameUrl, setFrame]);

  return (
    <div className="h-[600px] w-full rounded-2xl border bg-black">
      <Canvas
        camera={{
          position: [0, 1, 7],
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[2, 2, 2]}
        />
        <pointLight
          position={[-2, 2, 2]}
          intensity={2}
        />

        <Suspense fallback={ <CanvasLoader />}>
          {frameUrl && (
            <Model
              url={frameUrl}
            />
          )}

          <Environment preset="city" />
        </Suspense>

        <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
         />
      </Canvas>
    </div>
  );
}