"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface MirrorModelProps {
  reducedMotion: boolean;
}

function MirrorModel({ reducedMotion }: MirrorModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
    if (lightRef.current && !reducedMotion) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 2;
      lightRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 1.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={lightRef} position={[2, 2, 3]} intensity={1.2} color="#D8C7A3" />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#B08D57" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.6}
        color="#F4EFE6"
      />

      <Float
        speed={reducedMotion ? 0 : 0.8}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <group ref={groupRef}>
          {/* Pendant ring */}
          <mesh position={[0, 1.35, 0]}>
            <torusGeometry args={[0.08, 0.025, 16, 32]} />
            <meshStandardMaterial
              color="#B08D57"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
            <meshStandardMaterial
              color="#1A1512"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Outer rim */}
          <mesh>
            <torusGeometry args={[1, 0.08, 32, 64]} />
            <meshStandardMaterial
              color="#B08D57"
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>

          {/* Inner rim detail */}
          <mesh>
            <torusGeometry args={[0.92, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#D8C7A3"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Mirror surface */}
          <mesh>
            <circleGeometry args={[0.88, 64]} />
            <MeshDistortMaterial
              color="#0E0E0E"
              metalness={1}
              roughness={0.05}
              distort={0.08}
              speed={reducedMotion ? 0 : 0.5}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Ornamental dots */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const x = Math.cos(angle) * 0.96;
            const y = Math.sin(angle) * 0.96;
            return (
              <mesh key={i} position={[x, y, 0.05]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshStandardMaterial
                  color="#B08D57"
                  metalness={0.9}
                  roughness={0.3}
                />
              </mesh>
            );
          })}
        </group>
      </Float>

      <Environment preset="night" />
    </>
  );
}

interface MirrorCanvasProps {
  reducedMotion: boolean;
}

export default function MirrorCanvas({ reducedMotion }: MirrorCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <MirrorModel reducedMotion={reducedMotion} />
    </Canvas>
  );
}
