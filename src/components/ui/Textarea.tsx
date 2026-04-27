import React from 'react';
import { Label } from './Label';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <Label>{label}</Label>}
      <textarea 
        className={`w-full bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 text-zinc-400 text-sm leading-relaxed outline-none focus:border-indigo-900/30 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
};