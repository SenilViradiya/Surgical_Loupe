"use client";

import {
  useGLTF,
} from "@react-three/drei";

interface Props {
  url: string;
}

export function Model({
  url,
}: Props) {
  const { scene } =
    useGLTF(url);

  return (
    <primitive object={scene} />
  );
}