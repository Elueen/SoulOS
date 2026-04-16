import React from 'react';
import { LibraryItem } from "@/types";

interface TagEditorProps {
  data: LibraryItem;
  onUpdate: (newData: any) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">逻辑分类 / Category</label>
          <select 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-blue-500"
            value={data.category || "behavior"}
            onChange={e => onUpdate({...data, category: e.target.value})}
          >
            <option value="substance">SUBSTANCE (物质)</option>
            <option value="energy">ENERGY (能量)</option>
            <option value="behavior">BEHAVIOR (行为)</option>
            <option value="beast">BEAST (生物)</option>
            <option value="apparatus">APPARATUS (构造)</option>
            <option value="anatomy">ANATOMY (解剖)</option>
            <option value="special">SPECIAL (特殊逻辑)</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">标签逻辑定义</label>
        <textarea 
          className="w-full h-64 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 text-zinc-400 text-lg leading-relaxed outline-none" 
          value={data.description} 
          onChange={e => onUpdate({...data, description: e.target.value})} 
        />
      </div>
    </div>
  );
};1