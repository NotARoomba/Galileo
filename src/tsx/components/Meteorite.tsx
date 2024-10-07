import { a, useSpring } from "@react-spring/three";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import OrbitTrail from "./OrbitTrail"; // Add an orbit trail if needed (optional)

type GLTFResult = GLTF & {
  nodes: {
    Meteorite_Meteorite_Shader_Proxy_0: THREE.Mesh;
  };
  materials: {
    Meteorite_Shader_Proxy: THREE.MeshPhysicalMaterial;
  };
};

type MeteoriteProps = {
  position: [number, number, number]; // Position of the meteorite
  size: number; // Scale size of the meteorite
  rotationSpeed?: number; // Speed of rotation
  showTooltip: boolean;
  orbitPoints?: [number, number, number][]; // Optional orbit points for an orbit trail
  lineColor?: string; // Orbit trail color
  onClick: () => void; // Click handler for the meteorite
  name: string; // Name of the meteorite for tooltip display
  showOrbit: boolean;
};

export function Meteorite({
  position,
  size,
  rotationSpeed = 0.01,
  orbitPoints,
  showTooltip,
  lineColor = "rgba(255, 255, 255, 0.2)",
  showOrbit,
  onClick,
  name,
}: MeteoriteProps) {
  const { nodes, materials } = useGLTF("/models/meteorite.glb") as GLTFResult;
  const meteoriteRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<boolean>(false);

  useFrame(() => {
    if (meteoriteRef.current) {
      meteoriteRef.current.rotation.y += rotationSpeed; // Rotate the meteorite
    }
  });

  const { scale } = useSpring({
    scale: hovered ? size : size, // Scale up when hovered
    config: { tension: 300, friction: 30 },
  });

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
  };

  return (
    <>
      <a.group
        scale={scale}
        onClick={onClick}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        position={position}
        dispose={null}
      >
        <mesh
          ref={meteoriteRef}
          castShadow
          receiveShadow
          geometry={nodes.Meteorite_Meteorite_Shader_Proxy_0.geometry}
          material={materials.Meteorite_Shader_Proxy}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </a.group>

      {/* Optional Orbit Trail */}
      {orbitPoints && showOrbit && (
        <OrbitTrail
          onClick={onClick}
          lineColor={lineColor}
          points={orbitPoints}
          hovered={hovered}
          setHovered={handleHover}
        />
      )}

      {/* Tooltip */}

      {(showTooltip || hovered) && (
        <Html position={position} className="w-72 cursor-pointer">
          <div onClick={onClick} className="tooltip text-white font-bold">
            {name}
          </div>
        </Html>
      )}
    </>
  );
}

useGLTF.preload("/models/meteorite.glb");
