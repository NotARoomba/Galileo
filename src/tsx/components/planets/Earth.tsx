import { a, useSpring } from "@react-spring/three";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { PlanetProps } from "../../utils/Types";
import { Moon } from "../Moon"; // Import Moon component// Import computeOrbit for Earth's orbit
import OrbitTrail from "../OrbitTrail";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["moon.002"]: THREE.MeshStandardMaterial;
  };
};

export default function Earth({
  size,
  rotationSpeed = 0.01,
  inclination = 0,
  lineColor,
  onClick,
  orbitPoints,
  position,
  julianTime,
  name,
}: PlanetProps) {
  const { nodes, materials } = useGLTF("/models/earth.glb") as GLTFResult;
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.z += rotationSpeed;
    }
  });

  // Update planet position and inclination
  useEffect(() => {
    if (planetRef.current) {
      planetRef.current.rotation.x += 90;
      planetRef.current.position.set(0, 0, 0);
      planetRef.current.rotation.z = inclination * (Math.PI / 180);
    }
  }, [inclination]);

  // Compute Earth's orbit based on time (for orbit trail)
  //   const time = Date.now() / 1000;
  //   const earthOrbitPoints = computeOrbit(time, 'Earth'); // Use Earth's Keplerian elements

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    setShowTooltip(isHovered);
  };

  const { scale } = useSpring({
    scale: hovered ? size : size,
    config: { tension: 300, friction: 30 },
  });

  return (
    <>
      <a.group
        scale={scale}
        onClick={() => onClick()}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={position}
        dispose={null}
      >
        <mesh
          ref={planetRef}
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["moon.002"]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </a.group>

      {/* Earth's Orbit Trail */}
      <OrbitTrail
        onClick={onClick}
        lineColor={lineColor}
        points={orbitPoints}
        hovered={hovered}
        setHovered={handleHover}
      />

      {/* Moon Component - Rotating Around Earth */}
      <Moon
        position={position}
        julianTime={julianTime as number}
        onClick={onClick}
      />

      {/* Tooltip */}
      {showTooltip && (
        <Html key={position[0]} position={position} className="w-72">
          <div className="tooltip text-white font-bold">{name}</div>
        </Html>
      )}
    </>
  );
}

useGLTF.preload("/models/earth.glb");
