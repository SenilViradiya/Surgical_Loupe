"use client";

import { useMemo } from "react";

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
  const variant = useMemo(() => {
    if (url.includes("headlight")) {
      return "headlight";
    }

    if (url.includes("lens")) {
      return "lens";
    }

    return "frame";
  }, [url]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {variant === "frame" && (
        <group>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.8, 0.5, 1.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.45} metalness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.08, 0.62]}>
            <torusGeometry args={[0.8, 0.12, 16, 48]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.55} />
          </mesh>
          <mesh castShadow receiveShadow position={[-1.28, 0, 0]}>
            <boxGeometry args={[0.7, 0.16, 0.16]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.35} metalness={0.35} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.28, 0, 0]}>
            <boxGeometry args={[0.7, 0.16, 0.16]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.35} metalness={0.35} />
          </mesh>
        </group>
      )}

      {variant === "lens" && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.14, 32]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.12} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      )}

      {variant === "headlight" && (
        <group>
          <mesh castShadow receiveShadow position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.52, 32, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.05} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0, -0.28]}>
            <cylinderGeometry args={[0.32, 0.36, 0.45, 24]} />
            <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.3} />
          </mesh>
          <pointLight intensity={1.4} distance={3} color="#fef3c7" />
        </group>
      )}
    </group>
  );
}
