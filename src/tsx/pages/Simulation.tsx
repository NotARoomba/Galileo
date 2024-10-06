import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Planet from "../components/Planet";
import Sun from "../components/Sun";
import { PlanetData } from "../utils/Data";
import { dateToJulian, planetPosition, computeOrbit, SCALE, julianToDate } from "../utils/Functions";
import { KeplerianElement, Planets, SimplifiedPlanet } from "../utils/Types";
import moment from "moment";
import Loader from '../components/Loader';
import Modal from "../components/Modal";

export default function Simulation() {
  const [julianDate, setJulianDate] = useState<number>(dateToJulian(new Date()));
  const [paused, setPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // Speed multiplier
  const [targetSpeed, setTargetSpeed] = useState<number>(1); // For smooth transition
  const [planetPositions, setPlanetPositions] = useState<SimplifiedPlanet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal
  const [selectedPlanetData, setSelectedPlanetData] = useState<KeplerianElement | null>(null); // State for selected planet data
  const animationTimeoutRef = useRef<number | null>(null); // Reference for animation timeout

  // Calculate and update the planet positions
  useEffect(() => {
    const calculatePlanetPositions = () => {
      return Object.keys(PlanetData).map((key) => {
        const planet = PlanetData[key as keyof typeof PlanetData];
        const pos = planetPosition(julianDate, key as Planets);
        const orbitPoints = computeOrbit(julianDate, key as Planets);
        return { name: planet.object, position: pos, orbit: orbitPoints };
      });
    };

    if (intervalRef.current) clearInterval(intervalRef.current);

    // Update planet positions in intervals, using the new exponential time step
    intervalRef.current = setInterval(() => {
      if (!paused) {
        setPlanetPositions(calculatePlanetPositions());
        const timeStep = Math.sign(speed) * Math.max(10, Math.abs(speed)) * 0.001; // Increase time step with speed
        setJulianDate((prevDate) => prevDate + timeStep); // Faster progression as speed increases
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
      return Math.round(Math.min(prevSpeed * 10, 10000)); // Cap at 10000x forward speed
    });
  };

  const decreaseSpeed = () => {
    setTargetSpeed((prevSpeed) => {
      if (prevSpeed > 1) return Math.round(prevSpeed / 10); // Decrease from larger positive (100 -> 10)
      if (prevSpeed === 1) return -1; // Flip from 1 to -1
      return Math.round(Math.max(prevSpeed * 10, -10000)); // Cap at -10000x backward speed
    });
  };

  // Function to gradually change speed exponentially
  const smoothChangeSpeed = (currentSpeed: number, targetSpeed: number, factor: number) => {
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
    animationTimeoutRef.current = setTimeout(() => smoothChangeSpeed(nextSpeed, targetSpeed, factor), 10);
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
    const chevronCount = Math.min(Math.log10(Math.abs(speed)), 4) + 1; // Limit chevrons to a max of 4
    return Array.from({ length: chevronCount }, (_, i) =>
      direction === "left" ? <FaChevronLeft key={i} /> : <FaChevronRight key={i} />
    );
  };

  const handlePlanetClick = (planet: SimplifiedPlanet) => {
    setSelectedPlanetData(PlanetData[planet.name.toLowerCase()]);
    setIsModalOpen(true);
  };

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas className="w-screen h-screen" camera={{ far: 10000000 }}>
        {/* Rendering stars and sun */}
        <Stars radius={5000} depth={50} count={10000} factor={100} saturation={0} fade speed={1} />
        <Sun position={[0, 0, 0]} intensity={1000} size={(1 / SCALE) * 69634.0} />

        {/* Rendering planets */}
        {planetPositions.map((planet) => (
           <Planet
           key={planet.name}
           name={planet.name}
           onClick={() => handlePlanetClick(planet)} // Pass the planet data to the click handler
           textureUrl={`/textures/${planet.name.toLowerCase()}.jpg`}
           size={PlanetData[planet.name.toLowerCase()].size * (3 / SCALE)}
           position={[planet.position.x, planet.position.y, planet.position.z]}
           orbitPoints={planet.orbit.map((point) => [point.x, point.y, point.z])}
           lineColor={PlanetData[planet.name.toLowerCase()].lineColor}
           rotationSpeed={PlanetData[planet.name.toLowerCase()].rotationSpeed}
           inclination={PlanetData[planet.name.toLowerCase()].i_deg} 
         />
        ))}

        <OrbitControls zoom0={1 / (SCALE ** 2)} enableZoom={true} enablePan={false} enableRotate={true} target={[0, 0, 0]} />
        <ambientLight intensity={1} />
      </Canvas>
      {loading && <Loader onLoadComplete={handleLoadComplete} />}
      {/* Speed control and pause/play UI */}
      {!loading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center bg-opacity-75 bg-gray-900 p-4 rounded-lg">
          <p className="text-white font-bold text-3xl">{moment(julianToDate(julianDate)).format("DD MMM YYYY")}</p>
          <div className="flex space-x-4 mt-2 items-center">
            <button onClick={decreaseSpeed} className="bg-gray-800 text-white px-4 py-2 rounded flex items-center" disabled={speed === -10000}>
              {renderChevrons("left")}
            </button>
            <button onClick={togglePause} className="bg-gray-800 text-white px-4 py-2 rounded">
              {paused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={increaseSpeed} className="bg-gray-800 text-white px-4 py-2 rounded flex items-center" disabled={speed === 10000}>
              {renderChevrons("right")}
            </button>
          </div>
          <p className="text-white text-lg mt-2 font-semibold">Speed: {speed > 0 ? `x${Math.round(speed)}` : `x-${Math.abs(Math.round(speed))}`}</p>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} planetData={selectedPlanetData} />
    </div>
  );
}
