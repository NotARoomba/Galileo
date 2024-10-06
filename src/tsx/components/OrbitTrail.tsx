import React, { useRef, useEffect, useState, PointerEvent, Ref } from "react";
import { OrbitTrailProps } from "../utils/Types";
import * as THREE from "three";
import { Line } from "three";

export default function OrbitTrail({
  points,
  lineColor,
  hovered,
  setHovered,
  onClick,
}: OrbitTrailProps) {
  const lineRef = useRef<Line | null>(null); // Use Three.js Line type for ref

  if (!points || points.length < 2) return null;

  const closedPoints = [...points, points[0]];

  // Handle hover state and cursor change
  const handlePointerOver = (e: PointerEvent<SVGLineElement>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer"; // Change cursor to pointer on hover
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "default"; // Reset cursor when hover ends
  };

  return (
    <>
      {/* Thicker outer line for the bounding box effect */}
      <line
        ref={lineRef as Ref<SVGLineElement>}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(closedPoints.flat())}
            count={closedPoints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          linewidth={hovered ? 8 : 8} // Thicker boundary line (outer line)
          transparent={true}
          opacity={0.2} // Make it semi-transparent to distinguish from the main line
        />
      </line>

      {/* Main line */}
      <line
        ref={lineRef as Ref<SVGLineElement>}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(closedPoints.flat())}
            count={closedPoints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          linewidth={hovered ? 4 : 1} // Thinner main line
        />
      </line>
    </>
  );
}
