export interface OrbitTrailProps {
  lineColor: string;
  hovered: boolean;
  onClick: () => void;
  setHovered: (v: boolean) => void;
  points: [number, number, number][];
}
export interface PlanetProps {
  name: string;
  inclination: number;
  julianTime?: number;
  textureUrl: string;
  onClick: () => void;
  lineColor: string;
  size: number;
  rotationSpeed?: number;
  position: [number, number, number];
  orbitPoints: [number, number, number][];
}
export interface SunProps {
  position: [number, number, number];
  intensity?: number;
  size?: number;
}
export type KeplerianElement = {
  object: string;
  a: number; // Semi-major axis in AU
  a_dot: number; // Change in semi-major axis per year in AU/Cy
  e: number; // Eccentricity
  e_dot: number; // Change in eccentricity per year in rad/Cy
  i_deg: number; // Inclination in degrees
  i_dot: number; // Change in inclination per year in deg/Cy
  L_deg: number; // Mean longitude in degrees
  L_dot: number; // Change in mean longitude per year in deg/Cy
  w_deg: number; // Argument of periapsis in degrees
  w_dot: number; // Change in argument of periapsis per year in deg/Cy
  node_deg: number; // Longitude of ascending node in degrees
  node_dot: number; // Change in longitude of ascending node per year in deg/Cy
  size: number; // Size (radius) of the object in kilometers
  lineColor: string;
  rotationSpeed: number;
};

export enum Planets {
  Mercury = "Mercury",
  Venus = "Venus",
  Earth = "Earth",
  Mars = "Mars",
  Jupiter = "Jupiter",
  Saturn = "Saturn",
  Uranus = "Uranus",
  Neptune = "Neptune",
}

export interface PlanetInfo {
  name: string;
  a: number; // Example: substitute with the correct value from your data
  e: number; // Example: substitute with actual eccentricity value
  a_dot: number; // Example: substitute with actual velocity value
}

export interface SimplifiedPlanet {
  name: string;
  position: [number, number, number];
  orbit: [number, number, number][];
}
