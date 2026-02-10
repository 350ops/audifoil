'use client';

import { motion, type Variants } from 'framer-motion';
import React from 'react';

type AnimationType = 'fadeIn' | 'scaleIn' | 'slideInBottom' | 'slideInLeft';

const animations: Record<AnimationType, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInBottom: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
};

interface AnimatedDivProps {
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedDiv({
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  children,
  className,
}: AnimatedDivProps) {
  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay: delay / 1000, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
