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
        shadows
        camera={{
          position: [0, 1, 7],
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
        />
        <pointLight
          position={[-2, 2, 2]}
          intensity={2}
        />

        <Suspense fallback={<CanvasLoader />}>
          {frame && (
            <Model
              url={frame.modelUrl}
              scale={1.2}
              position={[0, -1, 0]}
            />
          )}

          {lens && (
            <Model
              url={lens.modelUrl}
              scale={0.6}
              position={[0, 0.2, 0.3]}
            />
          )}

          {headlight && (
            <Model
              url={
                headlight.modelUrl}
                 scale={0.4}
                 position={[0, 0.5, 0.8]}
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
              color="#222"
            />
          </mesh>

          <Environment preset="city" />
        </Suspense>

        <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={
          Math.PI / 2
        }
         />
      </Canvas>
    </div>
  );
}