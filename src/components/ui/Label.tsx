// src/components/ui/Label.tsx
import React from 'react';

export const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <label className={`text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-2 ${className}`}>
    {children}
  </label>
);