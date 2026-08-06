"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { ARCHTarget } from "@/types/platform";

interface TargetNodeProps {
  target: ARCHTarget;
  position: [number, number, number];
  onSelect?: (target: ARCHTarget) => void;
  isSelected?: boolean;
}

function TargetNode({ target, position, onSelect, isSelected }: TargetNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (target.currentDevStatus) {
      case "Launched":
        return "#10b981"; // emerald
      case "Phase 3":
        return "#3b82f6"; // blue
      case "Phase 2":
        return "#8b5cf6"; // purple
      case "Phase 1":
        return "#f59e0b"; // amber
      default:
        return "#ef4444"; // rose
    }
  }, [target.currentDevStatus]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const radius = Math.max(0.4, (target.swagScore / 10) * 0.7);

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={() => onSelect?.(target)}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.7}
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.6 : 0.1}
          />
        </mesh>
        <Text
          position={[0, radius + 0.35, 0]}
          fontSize={0.28}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {target.gene}
        </Text>
        <Text
          position={[0, -(radius + 0.3), 0]}
          fontSize={0.18}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {`SWAG: ${target.swagScore.toFixed(2)}`}
        </Text>
      </Float>
    </group>
  );
}

interface ThreeTargetViewerProps {
  targets: ARCHTarget[];
  selectedTarget?: ARCHTarget | null;
  onSelectTarget?: (target: ARCHTarget) => void;
}

export function ThreeTargetViewer({
  targets,
  selectedTarget,
  onSelectTarget,
}: ThreeTargetViewerProps) {
  // Calculate positions in a circular formation
  const nodePositions = useMemo(() => {
    const radius = 3.8;
    return targets.map((_, i) => {
      const angle = (i / targets.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(i * 1.5) * 0.7;
      return [x, y, z] as [number, number, number];
    });
  }, [targets]);

  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800">
      <div className="absolute top-3 left-4 z-10 pointer-events-none">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          3D Interactive ARCH Target Space (Slide 11)
        </p>
        <p className="text-xs text-slate-500">Orbit controls enabled • Click nodes to inspect</p>
      </div>

      <Canvas camera={{ position: [0, 2, 7], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.8} />

        {/* Central Hub */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#6366f1"
            wireframe
            emissive="#4f46e5"
            emissiveIntensity={0.5}
          />
        </mesh>

        {targets.map((target, idx) => (
          <TargetNode
            key={target.gene}
            target={target}
            position={nodePositions[idx] || [0, 0, 0]}
            isSelected={selectedTarget?.gene === target.gene}
            onSelect={onSelectTarget}
          />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
