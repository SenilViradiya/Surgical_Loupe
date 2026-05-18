"use client";

import {
  useGLTF,
} from "@react-three/drei";
import {useEffect} from "react";

interface Props {
  url: string;

  position?: [
    number,
    number,
    number
  ];

  rotation?: [
    number,
    number,
    number
  ];

  scale?: number;
}

export function Model({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: Props) {
  const { scene } =
    useGLTF(url);
    useEffect(() => {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;

          child.receiveShadow = true;
        }
      });
    }, [scene]);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
useGLTF.preload("/sample.glb");