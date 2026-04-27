// src/components/ui/Input.tsx
import React from 'react';
import { Label } from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <input 
        className={`w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-900/50 transition-all placeholder:text-zinc-800 ${className}`}
        {...props}
      />
    </div>
  );
};