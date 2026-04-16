import React from 'react';
import { PenTool } from "lucide-react";

interface AIResonancePanelProps {
  activeTabType: string;
}

export const AIResonancePanel: React.FC<AIResonancePanelProps> = ({ activeTabType }) => {
  return (
    <div className="w-80 bg-[#131314] border-l border-zinc-800 p-6 flex flex-col gap-6 shrink-0">
      {/* 顶部标识 */}
      <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_indigo]" /> 
        AI Logic
      </div>

      {/* 创作辅助卡片 */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-inner">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
          <PenTool size={14} className="text-indigo-400" /> 创作辅助
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          {activeTabType === 'novel' 
            ? "章节环境已对齐。系统将根据大纲与 Tags 进行逻辑校准。" 
            : "实体逻辑同步中。修改将即时影响位面底层真理。"}
        </p>
      </div>

      {/* 未来可以在这里扩展：AI 建议列表、灵感草稿箱等 */}
    </div>
  );
};