import React from 'react';
import { Trash2, Fingerprint, AlertCircle } from "lucide-react";
import { IconButton } from "../../ui/IconButton";

interface EntityHeaderProps {
  data: any;
  onUpdate: (newData: any) => void;
  onDelete: (id: string) => void;
  typeLabel: string;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({ data, onUpdate, onDelete, typeLabel }) => {
  return (
    <div className="flex items-end justify-between mb-12 pb-8 border-b border-zinc-800/50 group">
      <div className="flex-1 space-y-4">
        {/* 顶部标识：类型 + ID 编辑器 */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">
            {typeLabel}
          </span>
          
          <div className="flex items-center gap-2 group/id relative">
            <Fingerprint size={12} className="text-zinc-600 group-focus-within/id:text-indigo-400 transition-colors" />
            <input 
              className="bg-transparent border-none outline-none text-[10px] font-mono text-zinc-600 focus:text-indigo-400 transition-all w-48 tracking-tight"
              value={data.id}
              spellCheck={false}
              onChange={e => onUpdate({...data, id: e.target.value})}
              title="唯一识别码 (修改后需同步同步位面文件)"
            />
            {/* 提示小标签：仅在悬停时出现 */}
            <div className="absolute left-0 -top-6 opacity-0 group-hover/id:opacity-100 transition-opacity pointer-events-none flex items-center gap-1 text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded shadow-xl whitespace-nowrap z-20">
              <AlertCircle size={10} /> 修改 ID 会同步更改存储文件名
            </div>
          </div>
        </div>

        {/* 实体大标题：名称编辑器 */}
        <div className="relative">
          <input 
            className="text-4xl font-black bg-transparent border-none outline-none text-white placeholder:text-zinc-900 w-full tracking-tighter focus:placeholder:opacity-0 transition-all"
            placeholder="ENTER ENTITY NAME..."
            value={data.name}
            onChange={e => onUpdate({...data, name: e.target.value})}
          />
        </div>
      </div>

      {/* 危险操作区 */}
      <div className="flex items-center gap-2 ml-8 opacity-40 group-hover:opacity-100 transition-opacity">
        <IconButton 
          icon={<Trash2 size={20} />} 
          variant="danger" 
          onClick={() => {
            if (confirm(`警告：确定要永久抹除 [${data.name || data.id}] 吗？\n所有关联的位面档案将被同步删除。`)) {
              onDelete(data.id);
            }
          }}
          className="hover:bg-red-500/10 p-3 rounded-xl transition-all"
        />
      </div>
    </div>
  );
};