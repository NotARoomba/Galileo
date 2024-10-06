import { useRef } from "react";
import { Mesh } from "three";
import { SunProps } from "../utils/Types";

export default function Sun({ position, intensity = 1, size = 2 }: SunProps) {
    const sunRef = useRef<Mesh>(null);
  
    return (
      <>
        <mesh ref={sunRef} position={position}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
        {/* Directional light representing the Sun's light */}
        <pointLight intensity={intensity} position={position} />
      </>
    );
  };