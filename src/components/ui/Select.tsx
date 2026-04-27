// src/components/ui/Select.tsx
import React from 'react';
import { ChevronDown } from "lucide-react";
import { Label } from './Label';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <select 
          className={`w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none focus:border-indigo-900/50 appearance-none cursor-pointer transition-all ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};