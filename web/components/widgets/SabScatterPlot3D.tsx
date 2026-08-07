"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Award, Info, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComboPoint {
  name: string;
  aiScore: number;
  sabIntact: number;
  clinicalPrecedence: number;
  color: string;
  rank: number;
  rationale: string;
}

const COMBO_POINTS: ComboPoint[] = [
  {
    name: "IL6 | TNFSF13B",
    aiScore: 7.58,
    sabIntact: 0.80,
    clinicalPrecedence: 4.5,
    color: "#a855f7",
    rank: 1,
    rationale: "Dual suppression of plasma cell survival (BAFF) and plasmablast priming (IL-6).",
  },
  {
    name: "IL6 | TYK2",
    aiScore: 7.57,
    sabIntact: 0.78,
    clinicalPrecedence: 4.8,
    color: "#3b82f6",
    rank: 2,
    rationale: "Coordinated inhibition of JAK/STAT cytokine loop and IL-12/23 signaling.",
  },
  {
    name: "IL6 | TNFRSF13C",
    aiScore: 7.54,
    sabIntact: 0.77,
    clinicalPrecedence: 3.8,
    color: "#ec4899",
    rank: 3,
    rationale: "Direct BAFF-receptor pathway antagonism combined with IL-6 blockade.",
  },
  {
    name: "IL6 | NR3C1",
    aiScore: 7.50,
    sabIntact: 0.75,
    clinicalPrecedence: 4.9,
    color: "#10b981",
    rank: 4,
    rationale: "Steroid-sparing combination with broad glucocorticoid receptor synergy.",
  },
  {
    name: "IL6 | MS4A1 (CD20)",
    aiScore: 7.49,
    sabIntact: 0.74,
    clinicalPrecedence: 4.6,
    color: "#f59e0b",
    rank: 5,
    rationale: "Mature B-cell depletion + acute IL-6 systemic inflammatory dampening.",
  },
  {
    name: "IL6 | JAK1",
    aiScore: 7.42,
    sabIntact: 0.70,
    clinicalPrecedence: 4.7,
    color: "#06b6d4",
    rank: 8,
    rationale: "Downstream STAT3 signal blockade matching Rinvoq clinical mechanism.",
  },
  {
    name: "mTORC1 | Src (A-1984701)",
    aiScore: 7.95,
    sabIntact: 0.88,
    clinicalPrecedence: 3.5,
    color: "#14b8a6",
    rank: 0,
    rationale: "Slide 22 preclinical screen: dual metabolic & translational repression.",
  },
];

export function SabScatterPlot3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<ComboPoint>(COMBO_POINTS[0]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 320;

    let renderer: THREE.WebGLRenderer | null = null;
    let reqId: number | null = null;

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020617);

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(6, 5, 8);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // Orbit Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      // 3D Axis Grid Box
      const gridHelper = new THREE.GridHelper(6, 6, 0x334155, 0x1e293b);
      gridHelper.position.y = -1.5;
      scene.add(gridHelper);

      // Spheres for Combo Points
      const sphereGroup = new THREE.Group();

      COMBO_POINTS.forEach((pt) => {
        const x = (pt.aiScore - 7.5) * 6;
        const y = (pt.sabIntact - 0.75) * 8;
        const z = (pt.clinicalPrecedence - 4.0) * 3;

        const geometry = new THREE.SphereGeometry(pt.rank === 1 ? 0.32 : 0.22, 24, 24);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(pt.color),
          emissive: new THREE.Color(pt.color),
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.3,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData = { point: pt };
        sphereGroup.add(mesh);
      });

      scene.add(sphereGroup);

      // Raycaster for click interaction
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleClick = (e: MouseEvent) => {
        if (!renderer) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sphereGroup.children);
        if (intersects.length > 0) {
          const hit = intersects[0].object.userData.point as ComboPoint;
          if (hit) setSelectedPoint(hit);
        }
      };

      renderer.domElement.addEventListener("click", handleClick);

      const animate = () => {
        reqId = requestAnimationFrame(animate);
        controls.update();
        if (renderer) renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (reqId) cancelAnimationFrame(reqId);
        window.removeEventListener("resize", handleResize);
        if (renderer) {
          renderer.domElement.removeEventListener("click", handleClick);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("WebGL not supported in current environment, using canvas fallback:", err);
    }
  }, []);

  return (
    <div className="space-y-3 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              3D Synergy Topology
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3D sAB Intact vs Composite AI Score Scatter Space
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Three-dimensional synergy mapping: X (AI Score), Y (sAB Intact), Z (Clinical Precedence)
          </p>
        </div>

        <Badge variant="purple" className="font-mono text-[10px]">
          Interactive 3D Orbit
        </Badge>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative h-[320px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-2 left-2 pointer-events-none text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800 backdrop-blur-sm space-y-0.5">
          <p className="text-emerald-400 font-bold">● Click spheres to inspect combination</p>
          <p>Drag to rotate • Scroll to zoom</p>
        </div>
      </div>

      {/* Selected Point Inspection Dossier */}
      {selectedPoint && (
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedPoint.color }}
              />
              <span>{selectedPoint.name}</span>
            </span>
            <Badge variant="success">
              Rank #{selectedPoint.rank === 0 ? "Preclinical Lead" : selectedPoint.rank}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div>AI Score: <strong className="text-white">{selectedPoint.aiScore}</strong></div>
            <div>sAB Intact: <strong className="text-blue-400">{selectedPoint.sabIntact}</strong></div>
            <div>Precedence: <strong className="text-purple-400">{selectedPoint.clinicalPrecedence} / 5.0</strong></div>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {selectedPoint.rationale}
          </p>
        </div>
      )}
    </div>
  );
}
