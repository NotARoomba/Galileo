import { motion } from "framer-motion";

export default function Loader({
  onLoadComplete,
}: {
  onLoadComplete: () => void;
}) {
  const fadeVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 1, delay: 3 } },
  };

  return (
    <motion.div
      className="absolute flex top-0 left-0 w-screen h-screen bg-center bg-contain"
      style={{ backgroundImage: "url(/stars.gif)" }} // Change to your GIF path
      initial="initial"
      animate="animate"
      onAnimationComplete={onLoadComplete}
      variants={fadeVariants}
    >
      <motion.img
        src="/logo.png" // Change to your logo path
        alt="Logo"
        className="m-auto"
        initial={{ scale: 1 }}
        animate={{ scale: 1.5 }} // Logo zoom in effect
        transition={{ duration: 1 }} // Logo animation duration
      />
    </motion.div>
  );
}
