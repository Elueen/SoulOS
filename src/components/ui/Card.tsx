// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glow';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', className = "" }) => {
  const baseStyles = "relative rounded-3xl p-6 transition-all duration-500 border";
  const variants = {
    default: "bg-zinc-900/20 border-zinc-800/50",
    glow: "bg-[#1a1b1e] border-amber-900/30 shadow-[0_0_30px_rgba(146,64,14,0.05)] group-hover:border-amber-700/50"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {variant === 'glow' && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-900/20 to-amber-900/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};