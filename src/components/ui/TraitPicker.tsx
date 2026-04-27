import React from 'react';
import { TRAITS_LIST } from "@/constants/traits";
import { X } from "lucide-react";

// 确保这里的接口包含了 onClose
interface TraitPickerProps {
  selectedTraits: string[];
  onToggle: (id: string) => void;
  onClose: () => void; // 添加这一行
}

export const TraitPicker: React.FC<TraitPickerProps> = ({ selectedTraits, onToggle, onClose }) => {
  
  const isTraitDisabled = (traitId: string) => {
    if (selectedTraits.includes(traitId)) return false;
    if (selectedTraits.length >= 4) return true;

    return selectedTraits.some(selectedId => {
      const def = TRAITS_LIST.find(t => t.id === selectedId);
      return def?.conflicts.includes(traitId);
    });
  };

  return (
    <div className="absolute top-full left-0 mt-4 w-full z-50 bg-[#1e1f20] border border-zinc-800 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          性格特质配置网格 (最大4项)
        </span>
        <button 
          onClick={onClose} 
          className="text-zinc-600 hover:text-white transition-colors"
        >
          <X size={16}/>
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 max-h-[320px] overflow-y-auto pr-2 scrollbar-hide">
        {TRAITS_LIST.map(trait => {
          const isSelected = selectedTraits.includes(trait.id);
          const isDisabled = isTraitDisabled(trait.id);
          
          return (
            <button
              key={trait.id}
              disabled={isDisabled}
              onClick={() => onToggle(trait.id)}
              className={`
                px-2 py-3 text-[10px] font-bold rounded-lg border transition-all truncate
                ${isSelected ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                  isDisabled ? 'bg-zinc-900 border-zinc-800 text-zinc-800 cursor-not-allowed opacity-50' : 
                  'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}
              `}
              title={trait.description}
            >
              {trait.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};