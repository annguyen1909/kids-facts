"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        mass: 1,
        opacity: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
