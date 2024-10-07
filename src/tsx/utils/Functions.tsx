import { PlanetData } from "./Data";
import { KeplerianElement, Planets } from "./Types";

export const SCALE = 100000;
export const ORBIT_SCALE = 50;

// Function to compute the eccentric anomaly E from the mean anomaly M and eccentricity e
function solveKepler(M: number, e: number): number {
  let E = M; // Initial guess for E
  const delta = 1e-6; // Convergence tolerance
  let diff = 1; // Difference between E and the function value (to check convergence)

  while (Math.abs(diff) > delta) {
    diff = E - e * Math.sin(E) - M;
    E -= diff / (1 - e * Math.cos(E)); // Newton-Raphson iteration
  }

  return E;
}
// Convert a regular date to Julian Date
export function dateToJulian(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // months are zero-indexed in JS
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // Check if the month is January or February
  const Y = month <= 2 ? year - 1 : year;
  const M = month <= 2 ? month + 12 : month;

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  const JD =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    dayFraction +
    B -
    1524.5;

  return JD;
}

// Convert Julian Date to regular date
export function julianToDate(julianDate: number): Date {
  const J = julianDate + 0.5;
  const Z = Math.floor(J);
  const F = J - Z;

  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A += 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const dayFraction = day % 1;
  const hours = Math.floor(dayFraction * 24);
  const minutes = Math.floor((dayFraction * 24 - hours) * 60);
  const seconds = Math.floor(((dayFraction * 24 - hours) * 60 - minutes) * 60);

  return new Date(
    Date.UTC(year, month - 1, Math.floor(day), hours, minutes, seconds),
  );
}

// Updated function to calculate planet position with an optional Keplerian element
export function planetPosition(
  time: number,
  nameOrKepler: Planets | KeplerianElement | "Moon",
): [number, number, number] {
  let planet: KeplerianElement;

  if (typeof nameOrKepler === "string") {
    // Fetch planet data if the input is a planet name
    planet = PlanetData[nameOrKepler.toLowerCase()];
  } else {
    // If input is a Keplerian element, use it directly
    planet = nameOrKepler;
    // console.log(nameOrKepler)
  }

  const T = (time - 2451545.0) / 36525; // Julian centuries since J2000.0

  // Update Keplerian elements based on time T
  const a = planet.a + planet.a_dot * T; // Semi-major axis
  const e = planet.e + planet.e_dot * T; // Eccentricity
  const i_deg = planet.i_deg + planet.i_dot * T; // Inclination
  const L_deg = planet.L_deg + planet.L_dot * T; // Mean longitude
  const w_deg = planet.w_deg + planet.w_dot * T; // Longitude of perihelion
  const node_deg = planet.node_deg + planet.node_dot * T; // Longitude of ascending node

  // Compute argument of perihelion (ω) and mean anomaly (M)
  const omega = w_deg - node_deg; // Argument of perihelion
  const M_deg = L_deg - w_deg; // Mean anomaly

  // Ensure mean anomaly is between -180° and +180°
  let M = M_deg % 360;
  if (M > 180) M -= 360;
  if (M < -180) M += 360;

  // Convert M to radians for computation
  M = (M * Math.PI) / 180;

  // Compute eccentric anomaly E by solving Kepler's equation M = E - e * sin(E)
  const E = solveKepler(M, e);

  // Compute the heliocentric coordinates in the orbital plane
  const x_prime = a * (Math.cos(E) - e); // x' = a(cos(E) - e)
  const y_prime = a * Math.sqrt(1 - e * e) * Math.sin(E); // y' = a√(1 - e²)sin(E)

  // Compute the final heliocentric coordinates in the J2000 ecliptic plane
  const cos_omega = Math.cos((omega * Math.PI) / 180);
  const sin_omega = Math.sin((omega * Math.PI) / 180);
  const cos_node = Math.cos((node_deg * Math.PI) / 180);
  const sin_node = Math.sin((node_deg * Math.PI) / 180);
  const cos_i = Math.cos((i_deg * Math.PI) / 180);
  const sin_i = Math.sin((i_deg * Math.PI) / 180);

  const x_ecl =
    (cos_omega * cos_node - sin_omega * sin_node * cos_i) * x_prime +
    (-sin_omega * cos_node - cos_omega * sin_node * cos_i) * y_prime;
  const y_ecl =
    (cos_omega * sin_node + sin_omega * cos_node * cos_i) * x_prime +
    (-sin_omega * sin_node + cos_omega * cos_node * cos_i) * y_prime;
  const z_ecl = sin_omega * sin_i * x_prime + cos_omega * sin_i * y_prime;
  // console.log(x_ecl, y_ecl, z_ecl)
  // Return the x, y, and z coordinates in the J2000 ecliptic plane
  return [x_ecl * ORBIT_SCALE, y_ecl * ORBIT_SCALE, z_ecl * ORBIT_SCALE];
}

// Updated function to compute orbit with an optional Keplerian element
export function computeOrbit(
  time: number,
  nameOrKepler: Planets | KeplerianElement | "Moon",
  initial = [0, 0, 0],
  steps = 360,
): [number, number, number][] {
  let planet: KeplerianElement;

  if (typeof nameOrKepler === "string") {
    // Fetch planet data if the input is a planet name
    planet = PlanetData[nameOrKepler.toLowerCase()];
  } else {
    // If input is a Keplerian element, use it directly
    planet = nameOrKepler;
  }

  const T = (time - 2451545.0) / 36525; // Julian centuries since J2000.0

  // Update Keplerian elements based on time T
  const a = planet.a + planet.a_dot * T; // Semi-major axis
  const e = planet.e + planet.e_dot * T; // Eccentricity
  const i_deg = planet.i_deg + planet.i_dot * T; // Inclination
  const w_deg = planet.w_deg + planet.w_dot * T; // Longitude of perihelion
  const node_deg = planet.node_deg + planet.node_dot * T; // Longitude of ascending node

  // Compute argument of perihelion (ω)
  const omega = w_deg - node_deg; // Argument of perihelion

  const cos_omega = Math.cos((omega * Math.PI) / 180);
  const sin_omega = Math.sin((omega * Math.PI) / 180);
  const cos_node = Math.cos((node_deg * Math.PI) / 180);
  const sin_node = Math.sin((node_deg * Math.PI) / 180);
  const cos_i = Math.cos((i_deg * Math.PI) / 180);
  const sin_i = Math.sin((i_deg * Math.PI) / 180);

  // Array to store the orbit points
  const orbitPoints: [number, number, number][] = [];

  // Compute the orbit for each point (step)
  for (let step = 0; step < steps; step++) {
    const M_deg = (360 / steps) * step; // Divide the orbit into equal parts for each step
    const M = (M_deg * Math.PI) / 180; // Convert to radians

    // Compute eccentric anomaly E by solving Kepler's equation
    const E = solveKepler(M, e);

    // Compute the heliocentric coordinates in the orbital plane
    const x_prime = a * (Math.cos(E) - e); // x' = a(cos(E) - e)
    const y_prime = a * Math.sqrt(1 - e * e) * Math.sin(E); // y' = a√(1 - e²)sin(E)

    // Compute the final heliocentric coordinates in the J2000 ecliptic plane
    const x_ecl =
      (cos_omega * cos_node - sin_omega * sin_node * cos_i) * x_prime +
      (-sin_omega * cos_node - cos_omega * sin_node * cos_i) * y_prime;
    const y_ecl =
      (cos_omega * sin_node + sin_omega * cos_node * cos_i) * x_prime +
      (-sin_omega * sin_node + cos_omega * cos_node * cos_i) * y_prime;
    const z_ecl = sin_omega * sin_i * x_prime + cos_omega * sin_i * y_prime;

    // Scale the coordinates and add them to the orbitPoints array
    orbitPoints.push([
      x_ecl * ORBIT_SCALE + initial[0],
      y_ecl * ORBIT_SCALE + initial[1],
      z_ecl * ORBIT_SCALE + initial[2],
    ]);
  }

  // Return the array of orbit points
  return orbitPoints;
}
