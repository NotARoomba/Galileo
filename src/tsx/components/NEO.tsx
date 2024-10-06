import { a, useSpring } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import OrbitTrail from "./OrbitTrail";

interface NEOProps {
  objectName: string;
  position: [number, number, number];
  rotationSpeed?: number;
  orbitPoints: [number, number, number][];
  onClick: () => void;
}

export default function NEO({
  objectName,
  position,
  orbitPoints,
  rotationSpeed = 0.005, // Slower rotation speed
  onClick,
}: NEOProps) {
  const dotRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Rotate the gray dot
  useFrame(() => {
    if (dotRef.current) {
      dotRef.current.rotation.y += rotationSpeed;
    }
  });

  // Handle hover state and show tooltip
  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    setShowTooltip(isHovered);
  };

  // React Spring animation for smooth scale effect on hover
  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1, // Scale up on hover
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      {/* Animated gray dot */}
      <a.mesh
        ref={dotRef}
        onClick={() => onClick()}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={position}
        scale={scale}
      >
        {/* Small gray sphere to represent the dot */}
        <sphereGeometry args={[1, 16, 16]} /> {/* Small size */}
        <meshStandardMaterial color={"gray"} />
      </a.mesh>
      <OrbitTrail
        onClick={onClick}
        lineColor={"rgba(255, 255, 255, 0.2)"}
        points={orbitPoints}
        hovered={hovered}
        setHovered={handleHover}
      />
      {/* Tooltip */}
      {showTooltip && (
        <Html position={position} className="w-40">
          <div className="tooltip text-white font-bold">{objectName}</div>
        </Html>
      )}
    </>
  );
}
