import React from 'react';
import { LibraryItem } from "@/types";

interface PassiveEditorProps {
  data: LibraryItem;
  onUpdate: (newData: any) => void;
}

export const PassiveEditor: React.FC<PassiveEditorProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">特性类型 / Type</label>
          <select 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-blue-500"
            value={data.type || "resistance"}
            onChange={e => onUpdate({...data, type: e.target.value})}
          >
            <option value="buff">BUFF (属性增强)</option>
            <option value="resistance">RESISTANCE (损伤抗性)</option>
            <option value="speed">SPEED (移动/身法)</option>
            <option value="sense">SENSE (特殊感官)</option>
            <option value="special">SPECIAL (特殊逻辑)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">数值 / Value</label>
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-blue-400 font-mono outline-none" 
            value={data.value || ""} 
            onChange={e => onUpdate({...data, value: e.target.value})} 
          />
        </div>
      </div>
      <div className="space-y-6">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">效果描述</label>
        <textarea 
          className="w-full h-64 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 text-zinc-400 text-lg leading-relaxed outline-none" 
          value={data.description} 
          onChange={e => onUpdate({...data, description: e.target.value})} 
        />
      </div>
    </div>
  );
};