import React, { useState } from "react";
import { OrbitTrailProps } from "../utils/Types";
import { Html } from "@react-three/drei";

export default function OrbitTrail({ points, lineColor, hovered, setHovered, onClick }: OrbitTrailProps) {

  if (!points || points.length < 2) return null;

  const closedPoints = [...points, points[0]];

  return (
    <line
    onClick={onClick}
      onPointerOver={(e) => {e.stopPropagation();setHovered(true)}} // Show tooltip on hover
      onPointerOut={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(closedPoints.flat())}
          count={closedPoints.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="rgba(255, 255, 255, 0.1)" linewidth={hovered ? 4 : 1} />
      {/* Tooltip */}
      {/* {showTooltip && <Html position={closedPoints[0]}><div className="tooltip">Orbit</div></Html>} */}
    </line>
  );
}
