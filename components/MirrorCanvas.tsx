"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
// Bundled offline HDR (dark sky + tree-crown silhouettes) — no network needed.
import nightHdr from "@pmndrs/assets/hdri/night.exr";

interface MirrorModelProps {
  reducedMotion: boolean;
}

/**
 * Real Toli geometry — a shallow metal lens:
 *   • convex reflective FRONT (outer side of a sphere cap)
 *   • concave matte-metal BACK (inner side of a larger, gentler cap)
 * Both caps share the SAME rim circle (radius R at z = 0), so they meet in a
 * razor-thin lens edge — there is effectively no visible edge band, while the
 * centre still has enough thickness that the ruby can't poke through the front.
 */
const R = 1.0; // disc radius
const SF = 1.95; // front sphere radius (convex)
const SB = 2.6; // back sphere radius (gentler → shallow bowl)

const THETA_F = Math.asin(R / SF);
const THETA_B = Math.asin(R / SB);
const CF = -Math.sqrt(SF * SF - R * R); // front sphere centre z (base circle at z = 0)
const CB = -Math.sqrt(SB * SB - R * R); // back sphere centre z (base circle at z = 0)
const FRONT_POLE_Z = CF + SF; // ≈ +0.276
const BACK_POLE_Z = CB + SB; // ≈ +0.200 (deepest centre of the back bowl)

function MirrorModel({ reducedMotion }: MirrorModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[2.5, 2.5, 4]} intensity={1.1} color="#F4EFE6" />
      <pointLight position={[-3, -1, 3]} intensity={0.5} color="#B08D57" />
      <spotLight position={[0, 5, 4]} angle={0.35} penumbra={1} intensity={0.5} color="#fff3e0" />

      <Float
        speed={reducedMotion ? 0 : 0.8}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.3}
      >
        <group ref={groupRef}>
          {/* Bail — a simple ring that abuts the top of the disc (no stem). The
              centre is placed so the ring's lower arc overlaps the rim and
              visibly touches the mirror. */}
          <mesh position={[0, R + 0.052, 0.02]}>
            <torusGeometry args={[0.07, 0.022, 24, 48]} />
            <meshStandardMaterial color="#C79A60" metalness={1} roughness={0.22} envMapIntensity={1.2} />
          </mesh>

          {/* Convex reflective FRONT (outer cap) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, CF]}>
            <sphereGeometry args={[SF, 160, 120, 0, Math.PI * 2, 0, THETA_F]} />
            <meshStandardMaterial
              color="#B08D57"
              metalness={1}
              roughness={0.12}
              envMapIntensity={1.5}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Concave matte-metal BACK (inner cap) — shares the rim with the front */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, CB]}>
            <sphereGeometry args={[SB, 160, 120, 0, Math.PI * 2, 0, THETA_B]} />
            <meshStandardMaterial
              color="#5a4a30"
              metalness={1}
              roughness={0.5}
              envMapIntensity={0.5}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Small ruby set flush into the centre of the concave back */}
          <group position={[0, 0, BACK_POLE_Z - 0.05]}>
            <mesh position={[0, 0, 0.04]}>
              <torusGeometry args={[0.11, 0.018, 18, 40]} />
              <meshStandardMaterial color="#8a6a3c" metalness={1} roughness={0.35} envMapIntensity={0.4} />
            </mesh>
            <mesh scale={[1, 1, 0.4]} rotation={[0, 0, Math.PI / 4]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color="#7d101f"
                metalness={0.2}
                roughness={0.3}
                emissive="#33060d"
                emissiveIntensity={0.4}
                envMapIntensity={0.3}
              />
            </mesh>
          </group>
        </group>
      </Float>

      {/* The reflection you originally liked: dark sky + tree-crown silhouettes */}
      <Environment files={nightHdr as string} />
    </>
  );
}

interface MirrorCanvasProps {
  reducedMotion: boolean;
}

export default function MirrorCanvas({ reducedMotion }: MirrorCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <MirrorModel reducedMotion={reducedMotion} />
    </Canvas>
  );
}
