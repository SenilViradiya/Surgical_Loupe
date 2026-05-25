"use client";

import {
  Clone,
  useGLTF,
} from "@react-three/drei";
import { useEffect } from "react";
import { Mesh, Object3D } from "three";

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
    scene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Clone
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}