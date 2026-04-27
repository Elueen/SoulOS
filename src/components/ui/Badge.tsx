import React from 'react';
import { X } from "lucide-react";

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onDelete?: () => void;
  variant?: 'square' | 'pill';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  icon, 
  onDelete, 
  variant = 'square',
  className = "" 
}) => {
  const rounded = variant === 'pill' ? 'rounded-full' : 'rounded-lg';
  
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 
      bg-zinc-900 border border-zinc-800 
      ${rounded} text-[10px] font-bold uppercase tracking-wider 
      group relative transition-all
      ${className}
    `}>
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="truncate max-w-[80px]">{children}</span>
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // 防止触发父级点击
            onDelete();
          }} 
          className="flex items-center justify-center bg-zinc-800 text-zinc-500 rounded-full ml-1 p-0.5 hover:bg-red-900/40 hover:text-red-500 transition-colors"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};