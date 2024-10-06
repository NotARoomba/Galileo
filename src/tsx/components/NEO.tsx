import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

interface GrayDotProps {
  objectName: string;
  position: [number, number, number];
  rotationSpeed?: number;
  onClick: () => void;
}

export default function NEO({
  objectName,
  position,
  rotationSpeed = 0.005, // Slower rotation speed
  onClick,
}: GrayDotProps) {
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
        <sphereGeometry args={[0.1, 16, 16]} /> {/* Small size */}
        <meshStandardMaterial color={'gray'} />
      </a.mesh>

      {/* Tooltip */}
      {showTooltip && (
        <Html position={position} className="w-40">
          <div className="tooltip text-white font-bold">{objectName}</div>
        </Html>
      )}
    </>
  );
}
