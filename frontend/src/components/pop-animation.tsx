import { Variants } from "framer-motion";

const popAnimation: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      scale: {
        type: "spring",
        duration: 1.0,
        bounce: 0.5,
      },
    },
  },
};

export default popAnimation;
