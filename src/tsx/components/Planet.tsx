import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetProps } from '../utils/Types';
import OrbitTrail from './OrbitTrail';
import { Html } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three'; // Import animated from react-spring

export default function Planet({
  textureUrl,
  size,
  rotationSpeed = 0.01,
  inclination = 0,
  lineColor,
  onClick,
  orbitPoints,
  position,
  name,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<boolean>(false); // State for hover effect
  const [showTooltip, setShowTooltip] = useState<boolean>(false); // Tooltip visibility

  // Load planet texture
  const texture = useLoader(TextureLoader, textureUrl);

  // Rotate the planet
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
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

  // Handle hover state and show tooltip
  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    setShowTooltip(isHovered);
  };

  // React Spring animation for smooth scale effect on hover
  const { scale } = useSpring({
    scale: hovered ? size * 5 : size, // Scale up when hovered
    config: { tension: 300, friction: 30 }, // Adjust animation speed and bounciness
  });

  return (
    <>
      {/* Animated Planet Mesh using react-spring */}
      <a.mesh
        ref={planetRef}
        onClick={() => onClick()} // Call onClick from props
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={position}
        scale={scale} // Use animated scale from react-spring
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </a.mesh>

      {/* Render orbit trail */}
      <OrbitTrail onClick={onClick} lineColor={lineColor} points={orbitPoints} hovered={hovered} setHovered={handleHover} />

      {/* Tooltip */}
      {showTooltip && (
        <Html key={planetRef.current?.position.x} position={planetRef.current?.position} className="w-72">
          <div className="tooltip text-white font-bold">{name}</div>
        </Html>
      )}
    </>
  );
}
