// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block">
          {label}
        </label>
      )}
      <input 
        className={`w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-900/50 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};