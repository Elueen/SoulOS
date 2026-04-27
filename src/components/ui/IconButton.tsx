// src/components/ui/IconButton.tsx
import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'danger' | 'ghost';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, variant = 'ghost', className = "" }) => {
  const variants = {
    ghost: "text-zinc-700 hover:text-zinc-300",
    danger: "text-zinc-800 hover:text-red-500"
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${variants[variant]} ${className}`}
    >
      {icon}
    </button>
  );
};