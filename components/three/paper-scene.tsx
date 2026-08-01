"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import type { Group } from "three";

const TOKENS: { label: string; color: string; position: [number, number, number]; size: number }[] =
  [
    { label: "let", color: "#3B6FE0", position: [-2.4, 1.2, 0], size: 0.9 },
    { label: "x", color: "#2F9E6E", position: [-1.1, -0.9, 0.4], size: 0.7 },
    { label: "=", color: "#B25FD1", position: [0.2, 1.5, -0.3], size: 0.6 },
    { label: "3", color: "#F5A623", position: [1.3, 0.3, 0.2], size: 0.7 },
    { label: "+", color: "#B25FD1", position: [2.3, -1.0, -0.2], size: 0.6 },
    { label: "4", color: "#F5A623", position: [3.1, 0.9, 0.1], size: 0.7 },
    { label: ";", color: "#6B7267", position: [0.6, -1.6, 0.3], size: 0.55 },
  ];

function TokenCard({
  label,
  color,
  position,
  size,
}: (typeof TOKENS)[number]) {
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={1.6}>
      <group position={position}>
        <RoundedBox args={[size * 1.5, size, 0.12]} radius={0.09} smoothness={4}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.85} metalness={0} />
        </RoundedBox>
        <RoundedBox args={[size * 1.5, size, 0.04]} radius={0.09} smoothness={4} position={[0, 0, 0.05]}>
          <meshStandardMaterial color={color} roughness={0.9} metalness={0} transparent opacity={0.14} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.1]}
          fontSize={size * 0.42}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Scene() {
  const group = React.useRef<Group>(null);
  const pointer = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.current.x * 0.14 - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (pointer.current.y * 0.07 - group.current.rotation.x) * 0.06;
  });

  return (
    <group ref={group}>
      {TOKENS.map((t) => (
        <TokenCard key={t.label + t.position.join()} {...t} />
      ))}
    </group>
  );
}

export default function PaperScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[-4, 6, 5]} intensity={1.1} color="#fff4e0" />
        <directionalLight position={[4, -2, 3]} intensity={0.35} color="#edf3ff" />
        <Scene />
      </Canvas>
    </div>
  );
}
