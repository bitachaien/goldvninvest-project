// components/Animation/section-animation.tsx

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  customVariants?: Variants; // Accept custom animation variants
  visible?: boolean;
  delay?: number; // Add delay as a prop
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  customVariants = {}, // Default to an empty object
  visible = false,
  delay = 0, // Default delay is 0 seconds
  className,
}: SectionWrapperProps) => {
  const sectionRef: React.MutableRefObject<any> = useRef(null);
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(visible);

  const handleScroll = () => {
    if (sectionRef.current) {
      const boundingBox = sectionRef.current.getBoundingClientRect();
      if (typeof window !== "undefined") {
        setIsVisible(
          boundingBox.top <= window.innerHeight * 0.5 && boundingBox.bottom >= 0
        );
      }
    }
  };

  useEffect(() => {
    const scrollHandler = () => {
      handleScroll();
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  useEffect(() => {
    const startAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));

      if (isVisible) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    };

    isVisible && startAnimation();
  }, [isVisible, controls, delay]);

  return (
    <motion.div
      className={className ? className : ""}
      variants={{
        ...customVariants,
        // Add custom variants for initial, animate, and exit states
        hidden: { opacity: 0, x: -100 }, // Initial state (off-screen to the left)
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }, // Animated state
      }}
      initial="hidden"
      animate={controls}
      exit="hidden"
      ref={sectionRef}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;
