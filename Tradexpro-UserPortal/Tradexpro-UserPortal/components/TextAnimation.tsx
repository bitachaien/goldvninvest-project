import React from "react";
import { motion } from "framer-motion";

const TextAnimation = ({ text }: any) => {
  // Split the text into an array of individual characters
  // Split the text into an array of words
  const words = text.split(" ");

  // Get the first 3, 2, or 1 words based on availability
  const animatedWords = words.slice(0, 3); // Limit to first 3 words

  // Get the remaining words (those after the first 3)
  const remainingWords = words.slice(3);

  const characters = animatedWords.join(" ").split("");

  const nonAnimatedWords = remainingWords.slice(0, -2); // All but last two
  const redWords = remainingWords.slice(-2);

  // Define animation variants for each character
  const characterVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: any) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.07, // Stagger the animation of each character
      },
    }),
  };

  return (
    <div className=" tradex-inline tradex-whitespace-pre-wrap">
      {characters.map((char: any, index: any) => (
        <motion.span
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={characterVariants}
          className=" tradex-inline-block"
        >
          {char}
        </motion.span>
      ))}
      <span className="tradex-whitespace-pre-wrap"> {nonAnimatedWords.join(" ")}</span>
      {redWords.length > 0 && (
        <span className=" tradex-text-primary tradex-whitespace-pre-wrap"> {redWords.join(" ")}</span>
      )}
    </div>
  );
};

export default TextAnimation;
