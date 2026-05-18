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

        <Suspense fallback={<CanvasLoader />}>
          {frame && (
            <Model
              url={frame.modelUrl}
            />
          )}

          {lens && (
            <Model
              url={lens.modelUrl}
            />
          )}

          {headlight && (
            <Model
              url={
                headlight.modelUrl
              }
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