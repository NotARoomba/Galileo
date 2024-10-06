import { motion } from "framer-motion";
import { KeplerianElement } from "../utils/Types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  planetData: KeplerianElement | null; // Assuming PlanetData is the type for your planet data
}

const modalVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Modal({ isOpen, onClose, planetData }: ModalProps) {
  if (!isOpen || !planetData) return null;

  return (
    <motion.div
      className="bg-gray-900 absolute top-0 left-0 text-white p-6 rounded-lg shadow-lg max-w-sm w-full m-4"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-bold">{planetData.object}</h2>
      <p>Apoapsis: {(planetData.a * 2 * (1 + planetData.e)).toFixed(2)} AU</p>
      <p>Periapsis: {(planetData.a * 2 * (1 - planetData.e)).toFixed(2)} AU</p>
      <p>Eccentricity: {planetData.e}</p>
      <p>Distance from Sun: {planetData.a} AU</p>
      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </motion.div>
  );
}
