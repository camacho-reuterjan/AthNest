import { motion } from "framer-motion";

const dotTransition = {
  duration: 0.6,
  repeat: Infinity,
  ease: "easeInOut",
};

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 bg-accent rounded-full"
          animate={{ y: ["0%", "-60%", "0%"] }}
          transition={{ ...dotTransition, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export default LoadingAnimation;
