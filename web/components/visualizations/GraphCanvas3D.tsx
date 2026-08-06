"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { Graph3DNode, Graph3DEdge, Graph3DTopology } from "@/types/platform";

interface SphereNodeProps {
  node: Graph3DNode;
  isSelected: boolean;
  onSelect: (node: Graph3DNode) => void;
}

function SphereNode({ node, isSelected, onSelect }: SphereNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      if (isSelected) {
        const s = 1.0 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.set(s, s, s);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const radius = node.size * 0.55;

  return (
    <group position={[node.x, node.y, node.z]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
        >
          <sphereGeometry args={[radius, 24, 24]} />
          <meshStandardMaterial
            color={node.color}
            roughness={0.2}
            metalness={0.6}
            emissive={isSelected ? node.color : "#1e293b"}
            emissiveIntensity={isSelected ? 0.8 : 0.2}
          />
        </mesh>
        <Text
          position={[0, radius + 0.25, 0]}
          fontSize={0.22}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
        {node.swagScore && (
          <Text
            position={[0, -(radius + 0.2), 0]}
            fontSize={0.16}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {`SWAG: ${node.swagScore.toFixed(2)}`}
          </Text>
        )}
      </Float>
    </group>
  );
}

interface EdgeLineProps {
  edge: Graph3DEdge;
  nodesMap: Map<string, Graph3DNode>;
  isHighlighted: boolean;
}

function EdgeLine({ edge, nodesMap, isHighlighted }: EdgeLineProps) {
  const sourceNode = nodesMap.get(edge.source);
  const targetNode = nodesMap.get(edge.target);

  if (!sourceNode || !targetNode) return null;

  const points: [number, number, number][] = [
    [sourceNode.x, sourceNode.y, sourceNode.z],
    [targetNode.x, targetNode.y, targetNode.z],
  ];

  const color = isHighlighted ? "#38bdf8" : edge.color || "#475569";
  const lineWidth = isHighlighted ? 3 : 1.2;

  return <Line points={points} color={color} lineWidth={lineWidth} opacity={isHighlighted ? 0.9 : 0.4} transparent />;
}

interface GraphCanvas3DProps {
  topology: Graph3DTopology;
  selectedNode: Graph3DNode | null;
  onSelectNode: (node: Graph3DNode) => void;
}

export function GraphCanvas3D({ topology, selectedNode, onSelectNode }: GraphCanvas3DProps) {
  const nodesMap = useMemo(() => {
    const map = new Map<string, Graph3DNode>();
    topology.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [topology.nodes]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
      {/* 3D Legend & Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs uppercase tracking-wider text-slate-200 font-bold">
            3D Molecular & Pathway Network (60 FPS)
          </p>
        </div>
        <p className="text-[11px] text-slate-400 font-mono">
          {topology.metrics.backend || "SQLite-Graph-Engine"} • {topology.nodes.length} Nodes • {topology.edges.length} Edges
        </p>
      </div>

      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex flex-wrap gap-2 text-[10px] font-semibold">
        <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/40">● Gene MOA</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">● Compound</span>
        <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800/40">● Pathway</span>
        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/40">● Assay</span>
        <span className="px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-400 border border-pink-800/40">● Disease</span>
      </div>

      <Canvas camera={{ position: [0, 2, 11], fov: 48 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[12, 12, 12]} intensity={1.6} />
        <pointLight position={[-12, -12, -12]} color="#818cf8" intensity={1.0} />

        {/* Center Nucleus */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#6366f1" wireframe emissive="#4f46e5" emissiveIntensity={0.5} />
        </mesh>

        {/* Edges */}
        {topology.edges.map((edge) => (
          <EdgeLine
            key={edge.id}
            edge={edge}
            nodesMap={nodesMap}
            isHighlighted={selectedNode ? edge.source === selectedNode.id || edge.target === selectedNode.id : false}
          />
        ))}

        {/* Nodes */}
        {topology.nodes.map((node) => (
          <SphereNode
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelect={onSelectNode}
          />
        ))}

        <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
