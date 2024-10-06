import { a, useSpring } from "@react-spring/three";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["moon.008"]: THREE.MeshStandardMaterial;
  };
};

type MoonProps = {
  julianTime: number;
  position: [number, number, number]; // Position of Earth (center of the orbit)
  onClick: () => void;
};

const ORBIT_RADIUS = 5; // Fixed distance (radius) for the Moon's orbit around Earth
const ORBIT_STEPS = 3600 * 2; // Number of points in the orbit

// Function to generate orbit points for a circular orbit
function generateOrbitPoints(
  center: [number, number, number],
  radius: number,
  steps: number,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2; // Angle in radians
    const y = radius * Math.sin(angle) - 2 * radius; // X position
    const x = radius * Math.cos(angle); // Z position (we assume the orbit is in the XZ plane)
    points.push([x, y, center[2]]); // Y remains constant (center[1])
  }
  return points;
}

export function Moon({ position, onClick }: MoonProps) {
  const { nodes, materials } = useGLTF("/models/moon.glb") as GLTFResult;
  const moonRef = useRef<THREE.Mesh>(null);
  const [orbitPoints, setOrbitPoints] = useState<[number, number, number][]>(
    [],
  );
  const [currentStep, setCurrentStep] = useState(0); // Keep track of the Moon's current position along the orbit
  const [hovered, setHovered] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    // Generate orbit points around the given position (Earth's position)
    const orbit = generateOrbitPoints(position, ORBIT_RADIUS, ORBIT_STEPS);
    setOrbitPoints(orbit);
  }, [position]);

  useFrame(() => {
    if (moonRef.current && orbitPoints.length > 0) {
      // Update Moon's position along the orbit
      const newStep = (currentStep + 1) % ORBIT_STEPS; // Move to the next step
      const [x, y, z] = orbitPoints[newStep];
      moonRef.current.position.set(x, y, z);
      setCurrentStep(newStep); // Update the current step
      moonRef.current.rotation.y += 0.0005; // Rotate the Moon
    }
  });

  const { scale } = useSpring({
    scale: hovered ? 0.1 : 0.1,
    config: { tension: 300, friction: 30 },
  });

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    setShowTooltip(isHovered);
  };

  return (
    <>
      <a.group
        scale={scale}
        onClick={onClick}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={[position[0], position[1] + 1, position[2]]} // The Moon orbits around the position of the Earth
        dispose={null}
      >
        <mesh
          ref={moonRef}
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["moon.008"]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={onClick}
        />
      </a.group>
      {/* <OrbitTrail
        onClick={onClick}
        lineColor={"rgba(255, 255, 255, 0.2)"}
        points={orbitPoints.map((v) => [v[0]-position[0], v[1]+position[1], v[2]-position[2]])}
        hovered={hovered}
        setHovered={handleHover}
      /> */}
      {showTooltip && (
        <Html key={position[0]} position={position} className="w-72">
          <div className="tooltip text-white font-bold">Moon</div>
        </Html>
      )}
    </>
  );
}

useGLTF.preload("/models/moon.glb");
