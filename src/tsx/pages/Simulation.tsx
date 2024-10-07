import { a, useSpring } from "@react-spring/three";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import moment from "moment";
import { Suspense, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";
import { Vector3 } from "three";
import Loader from "../components/Loader";
import { Meteorite } from "../components/Meteorite";
import Modal from "../components/Modal";
import Earth from "../components/planets/Earth";
import Jupiter from "../components/planets/Jupiter";
import Mars from "../components/planets/Mars";
import Mercury from "../components/planets/Mercury";
import Neptune from "../components/planets/Neptune";
import Saturn from "../components/planets/Saturn";
import Uranus from "../components/planets/Uranus";
import Venus from "../components/planets/Venus";
import Sun from "../components/Sun";
import { PlanetData } from "../utils/Data";
import {
  SCALE,
  computeOrbit,
  dateToJulian,
  julianToDate,
  planetPosition,
} from "../utils/Functions";
import { KeplerianElement, Planets, SimplifiedPlanet } from "../utils/Types";

export default function Simulation() {
  const [julianDate, setJulianDate] = useState<number>(
    dateToJulian(new Date()),
  );
  const [paused, setPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // Speed multiplier
  const [targetSpeed, setTargetSpeed] = useState<number>(1); // For smooth transition
  const [planetPositions, setPlanetPositions] = useState<SimplifiedPlanet[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal
  const [selectedPlanetData, setSelectedPlanetData] =
    useState<KeplerianElement | null>(null); // State for selected planet data
  const [focusedPlanet, setFocusedPlanet] = useState<Planets | "Sun">("Sun");
  const animationTimeoutRef = useRef<number | null>(null); // Reference for animation timeout
  const [asteroidsRAW, setAsteroidsRAW] = useState<KeplerianElement[]>([]);
  const [asteroids, setAsteroids] = useState<SimplifiedPlanet[]>([]);
  const orbitControlsRef = useRef();
  const focusedPlanetPosition =
    focusedPlanet === "Sun"
      ? ([0, 0, 0] as [number, number, number]) // Sun's position
      : (planetPositions.find((planet) => planet.name === focusedPlanet)
          ?.position ??
        asteroids.find((planet) => planet.name === focusedPlanet)?.position);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showOrbit, setShowOrbit] = useState(true);
  // Spring animation for smooth camera movement
  const { position } = useSpring({
    position: (focusedPlanetPosition || [0, 0, 50]) as [number, number, number], // Default to [0,0,50] if no planet is found
    config: { tension: 120, friction: 20 }, // Adjust spring tension and friction for smoothness
  });

  // Function to handle planet focus change
  const handleFocusPlanet = (newPlanet: Planets | "Sun") => {
    setFocusedPlanet(newPlanet);
  };

  // Fetch asteroid data from NASA's Open Data API
  const calclateAsteroidPositions = (a: KeplerianElement[]) => {
    return a.map((asteroid, i) => {
      const pos = planetPosition(julianDate, asteroid);
      // if (i == 0) console.log(pos)
      const orbitPoints = computeOrbit(julianDate, asteroid);
      return { name: asteroid.object, position: pos, orbit: orbitPoints };
    });
  };
  const calculatePlanetPositions = () => {
    return Object.keys(PlanetData).map((key) => {
      const planet = PlanetData[key as keyof typeof PlanetData];
      const pos = planetPosition(julianDate, key as Planets);
      const orbitPoints = computeOrbit(julianDate, key as Planets);
      return { name: planet.object, position: pos, orbit: orbitPoints };
    });
  };
  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await fetch(
          "https://data.nasa.gov/resource/b67r-rgxc.json",
        );
        const data = await response.json();

        data.length = 5;

        const transformedAsteroids = data.map(
          (asteroid: any): KeplerianElement => {
            return {
              object: asteroid.object_name,
              a:
                (parseFloat(asteroid.q_au_1) + parseFloat(asteroid.q_au_2)) / 2, // Semi-major axis (average of perihelion and aphelion)
              a_dot: 0, // Placeholder, you may want to compute or estimate this
              e: parseFloat(asteroid.e), // Eccentricity
              e_dot: 0.00004392, // Placeholder
              i_deg: parseFloat(asteroid.i_deg), // Inclination in degrees
              i_dot: 0.00004392, // Placeholder
              L_deg: 100, // Placeholder (Mean longitude)
              L_dot: 500, // Placeholder
              w_deg: parseFloat(asteroid.w_deg), // Argument of periapsis
              w_dot: 0, // Placeholder
              node_deg: parseFloat(asteroid.node_deg), // Longitude of ascending node
              node_dot: 1, // Placeholder
              size: parseFloat(asteroid.moid_au) * SCALE, // Assuming MOID gives a rough idea of size
              lineColor: "gray", // Customize based on conditions, or leave it static
              rotationSpeed: 0.01, // Static or computed based on object properties
            };
          },
        );
        setAsteroidsRAW(transformedAsteroids);
        setAsteroids(calclateAsteroidPositions(transformedAsteroids));
      } catch (error) {
        console.error("Error fetching asteroid data:", error);
      }
    };

    fetchAsteroids();
  }, []);

  // Calculate and update the planet positions
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Update planet positions in intervals, using the new exponential time step
    intervalRef.current = setInterval(() => {
      if (!paused) {
        setPlanetPositions(calculatePlanetPositions());
        setAsteroids(calclateAsteroidPositions(asteroidsRAW));
        const timeStep =
          Math.sign(speed) *
          Math.max(10, Math.abs(speed)) *
          (speed < 10 ? 0.00000005 : 0.0001); // Increase time step with speed
        setJulianDate(
          (prevDate) => prevDate + (speed == 1 ? 8.168808781403e-7 : timeStep),
        ); // Faster progression as speed increases
      }
    }, 10);

    return () => clearInterval(intervalRef.current);
  }, [paused, speed, julianDate]);

  const handleLoadComplete = () => setLoading(false);
  const togglePause = () => setPaused(!paused);

  const increaseSpeed = () => {
    setTargetSpeed((prevSpeed) => {
      if (prevSpeed < -1) return Math.round(prevSpeed / 10); // Increase from larger negative (-100 -> -10)
      if (prevSpeed === -1) return 1; // Flip from -1 to 1
      return Math.round(Math.min(prevSpeed * 10, 1000000)); // Cap at 10000x forward speed
    });
  };

  const decreaseSpeed = () => {
    setTargetSpeed((prevSpeed) => {
      if (prevSpeed > 1) return Math.round(prevSpeed / 10); // Decrease from larger positive (100 -> 10)
      if (prevSpeed === 1) return -1; // Flip from 1 to -1
      return Math.round(Math.max(prevSpeed * 10, -1000000)); // Cap at -10000x backward speed
    });
  };

  // Function to gradually change speed exponentially
  const smoothChangeSpeed = (
    currentSpeed: number,
    targetSpeed: number,
    factor: number,
  ) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); // Clear existing animation

    // Calculate the difference between current speed and target speed
    const delta = targetSpeed - currentSpeed;

    // If the delta is small enough, set the speed to the target speed
    if (Math.abs(delta) < 0.01) {
      setSpeed(targetSpeed);
      return;
    }

    // Exponential approach
    const nextSpeed = currentSpeed + delta * factor; // Adjust speed by a factor of the difference
    setSpeed(nextSpeed); // Update speed
    animationTimeoutRef.current = setTimeout(
      () => smoothChangeSpeed(nextSpeed, targetSpeed, factor),
      10,
    );
  };

  // Animate speed towards target
  useEffect(() => {
    if (speed !== targetSpeed) {
      const factor = 0.09; // Exponential factor for speed change (you can adjust this for sensitivity)
      smoothChangeSpeed(speed, targetSpeed, factor);
    }
  }, [targetSpeed]);

  // Helper function to render chevrons based on speed
  const renderChevrons = (direction: "left" | "right") => {
    const chevronCount = Math.min(Math.log10(Math.abs(speed)), 6) + 1; // Limit chevrons to a max of 4
    return Array.from({ length: chevronCount }, (_, i) =>
      direction === "left" ? (
        <FaChevronLeft key={i} />
      ) : (
        <FaChevronRight key={i} />
      ),
    );
  };

  const handlePlanetClick = (planet: SimplifiedPlanet) => {
    setFocusedPlanet(planet.name as Planets);
    setSelectedPlanetData(
      PlanetData[planet.name.toLowerCase()] ??
        asteroidsRAW.find((v) => v.object == planet.name),
    );
    setIsModalOpen(true);
  };

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas
        className="w-screen h-screen"
        camera={{ far: 1000000, position: new Vector3(0, 0, 50) }}
      >
        <Suspense>
          {/* Rendering stars and sun */}
          <Stars
            radius={5000}
            depth={50}
            count={10000}
            factor={100}
            saturation={0}
            fade
            speed={1}
          />
          <Sun
            position={[0, 0, 0]}
            intensity={1000}
            size={(1 / SCALE) * 69634.0}
          />
          {/* Manually rendering each planet */}
          {planetPositions.map((planet) => {
            const planetComponentProps = {
              name: planet.name,
              onClick: () => handlePlanetClick(planet),
              textureUrl: `/textures/${planet.name.toLowerCase()}.jpg`,
              size: PlanetData[planet.name.toLowerCase()].size * (3 / SCALE),
              position: planet.position,
              orbitPoints: planet.orbit,
              showTooltip,
              showOrbit,
              lineColor: PlanetData[planet.name.toLowerCase()].lineColor,
              rotationSpeed:
                PlanetData[planet.name.toLowerCase()].rotationSpeed,
              inclination: PlanetData[planet.name.toLowerCase()].i_deg,
            };

            // Manually render each planet component
            switch (planet.name) {
              case "Mercury":
                return <Mercury key={planet.name} {...planetComponentProps} />;
              case "Venus":
                return <Venus key={planet.name} {...planetComponentProps} />;
              case "Earth":
                return (
                  <Earth
                    key={planet.name}
                    julianTime={julianDate}
                    {...planetComponentProps}
                  />
                );
              case "Mars":
                return <Mars key={planet.name} {...planetComponentProps} />;
              case "Jupiter":
                return <Jupiter key={planet.name} {...planetComponentProps} />;
              case "Saturn":
                return <Saturn key={planet.name} {...planetComponentProps} />;
              case "Uranus":
                return <Uranus key={planet.name} {...planetComponentProps} />;
              case "Neptune":
                return <Neptune key={planet.name} {...planetComponentProps} />;
              default:
                return null;
            }
          })}

          {asteroids.map((asteroid) => (
            <Meteorite
              orbitPoints={asteroid.orbit}
              showOrbit={showOrbit}
              showTooltip={showTooltip}
              position={asteroid.position}
              name={asteroid.name}
              onClick={() => {
                handlePlanetClick(asteroid);
              }}
              size={(1 / SCALE) * 50000}
            />
          ))}
          {/* <SkyBox /> */}
          <a.group position={position}>
            <OrbitControls
              ref={orbitControlsRef as unknown as any}
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              target={new Vector3(...position.get())}
            />
          </a.group>
          <ambientLight intensity={1} />
        </Suspense>
      </Canvas>
      {loading && <Loader onLoadComplete={handleLoadComplete} />}
      {/* Speed control and pause/play UI */}

      {!loading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center bg-opacity-75 bg-gray-900 p-4 rounded-lg">
          <p className="text-white font-bold text-3xl text-center">
            {moment(julianToDate(julianDate)).format("HH:mm:ss DD MMM YYYY")}
          </p>
          <div className="flex space-x-4 mt-2 items-center">
            <button
              onClick={decreaseSpeed}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
            >
              {renderChevrons("left")}
            </button>
            <button
              onClick={togglePause}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              {paused ? <FaPlay /> : <FaPause />}
            </button>
            <button
              onClick={increaseSpeed}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
            >
              {renderChevrons("right")}
            </button>
          </div>
          <p className="text-white text-lg mt-2 font-semibold">
            Speed:{" "}
            {speed > 0
              ? `x${Math.round(speed)}`
              : `x-${Math.abs(Math.round(speed))}`}
          </p>
        </div>
      )}
      {!loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center bg-opacity-75 bg-gray-900 p-4 rounded-lg">
          <p className="text-white font-bold text-3xl">{focusedPlanet}</p>
          <div className="flex space-x-4 mt-2 items-center">
            <button
              onClick={() => {
                setFocusedPlanet((v) =>
                  v == "Sun"
                    ? ("Neptune" as Planets)
                    : (Object.values(Planets)[
                        Object.values(Planets).indexOf(v) - 1
                      ] ?? "Sun"),
                );
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
            >
              <FaChevronLeft />
            </button>
            <div className="flex flex-col gap-y-2">
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="bg-gray-800 font-semibold text-white px-4 py-2 rounded"
              >
                {showTooltip ? "Hide" : "Show"} Tooltips
              </button>
              <button
                onClick={() => setShowOrbit(!showOrbit)}
                className="bg-gray-800 font-semibold text-white px-4 py-2 rounded"
              >
                {showOrbit ? "Hide" : "Show"} Orbits
              </button>
            </div>

            <button
              onClick={() =>
                setFocusedPlanet((v) =>
                  v == "Sun"
                    ? ("Mercury" as Planets)
                    : (Object.values(Planets)[
                        Object.values(Planets).indexOf(v) + 1
                      ] ?? "Sun"),
                )
              }
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planetData={selectedPlanetData}
      />
    </div>
  );
}
