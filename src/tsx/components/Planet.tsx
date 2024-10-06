import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetProps } from '../utils/Types';
import OrbitTrail from './OrbitTrail';
import { useControls, Leva } from 'leva';
import { Html } from '@react-three/drei';

export default function Planet({
  textureUrl,
  size: initialSize,
  rotationSpeed: initialRotationSpeed = 0.01,
  inclination: initialInclination = 0,
  lineColor,
  onClick,
  orbitPoints,
  position,
  name,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [open, setOpen] = useState<boolean>(false); // State for Leva modal visibility
  const [hovered, setHovered] = useState<boolean>(false); // State for hover effect
  const [showTooltip, setShowTooltip] = useState<boolean>(false); // Tooltip visibility

  // Load planet texture
  const texture = useLoader(TextureLoader, textureUrl);

  // Leva controls for tweaking planet properties
  const { size, rotationSpeed, inclination } = useControls(
    name || 'Planet Properties',
    {
      size: { value: initialSize, min: 0.1, max: 10, step: 0.1 },
      rotationSpeed: { value: initialRotationSpeed, min: 0.001, max: 1, step: 0.001 },
      inclination: { value: initialInclination, min: 0, max: 90, step: 1 },
    },
    { collapsed: !open }
  );

  // Rotate the planet
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  // Update planet position, size, and inclination
  useEffect(() => {
    if (planetRef.current) {
      planetRef.current.rotation.x += 90;
      planetRef.current.position.set(0, 0, 0);
      planetRef.current.scale.set(size, size, size);
      planetRef.current.rotation.z = inclination * (Math.PI / 180);
    }
  }, [size, inclination]);

  // Function to handle hover state
  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    setShowTooltip(isHovered);
  };

  return (
    <>
      {/* Planet Mesh */}
      <mesh
        ref={planetRef}
        onClick={() => { onClick(); setOpen(true); }} // Call onClick from props
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={position}
      >
        <sphereGeometry args={[size * (hovered ? 1.2 : 1), 32, 32]} />
        <meshStandardMaterial map={texture} />

        {/* Outline when hovered */}
        {hovered && (
          <mesh>
            <sphereGeometry args={[size * (hovered ? 1.2 : 1), 32, 32]} />
            <meshBasicMaterial color={lineColor} wireframe />
          </mesh>
        )}
      </mesh>

      {/* Render orbit trail */}
      <OrbitTrail onClick={onClick} lineColor={lineColor} points={orbitPoints} hovered={hovered} setHovered={handleHover} />

      {/* Tooltip */}
      {showTooltip && (
        <Html position={planetRef.current?.position}>
          <div className="tooltip text-white font-bold">{name}</div>
        </Html>
      )}
      {/* <Html className='text-white font-sans'>
        <Leva />
      </Html> */}
    </>
  );
}
