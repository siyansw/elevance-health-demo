import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  gradient,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden';
  const hoverStyles = hover ? 'cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-elevance-lightblue/50' : '';
  const gradientStyles = gradient ? `bg-gradient-to-br ${gradient}` : '';

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
