import React from 'react';
import { Zap, Sword, Trash2, Sparkles } from "lucide-react";
import { Soul, LibraryItem } from "@/types";

interface SoulEditorProps {
  data: Soul;
  passivesData: LibraryItem[];
  tagsData: LibraryItem[];
  onUpdate: (newData: any) => void;
}

export const SoulEditor: React.FC<SoulEditorProps> = ({ data, passivesData, tagsData, onUpdate }) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-16">
        {/* 左侧：基础信息 */}
        <div className="space-y-6">
          <div className="mb-4">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">武魂种类 / Soul Type</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-blue-500"
              value={data.category || "Apparatus"}
              onChange={e => onUpdate({...data, category: e.target.value})}
            >
              <option value="Apparatus">器武魂 (Apparatus)</option>
              <option value="Beast">兽武魂 (Beast)</option>
              <option value="Body">本体武魂 (Body)</option>
              <option value="Other">其他 (Other)</option>
            </select>
          </div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">核心描述</label>
          <textarea 
            className="w-full h-[320px] bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 text-zinc-400 text-sm leading-relaxed outline-none" 
            value={data.description} 
            onChange={e => onUpdate({...data, description: e.target.value})} 
          />
        </div>

        {/* 右侧：武魂真身 + 逻辑组件 */}
        <div className="space-y-10">
          {/* 武魂真身卡片 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-900/50 to-amber-900/50 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#1a1b1e] border border-amber-900/30 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={12} /> True Form / 武魂真身</label>
                <div className="px-1.5 py-0.5 rounded border border-amber-900/40 text-[8px] text-amber-700 font-mono">LV.70</div>
              </div>
              <input className="bg-transparent text-xl font-black text-zinc-100 outline-none w-full" value={data.true_form?.name || ""} onChange={e => onUpdate({...data, true_form: {...data.true_form, name: e.target.value}})} />
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">增幅效果</span>
                <input className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-1.5 text-[11px] text-amber-200/70 outline-none" value={data.true_form?.boost_effect || ""} onChange={e => onUpdate({...data, true_form: {...data.true_form, boost_effect: e.target.value}})} />
              </div>
              <textarea className="w-full h-20 bg-transparent text-zinc-500 text-[11px] leading-snug outline-none resize-none" value={data.true_form?.description || ""} onChange={e => onUpdate({...data, true_form: {...data.true_form, description: e.target.value}})} />
            </div>
          </div>

          {/* 被动与标签 */}
          <div className="space-y-8">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> 被动特性</label>
              <div className="bg-zinc-900/20 p-4 rounded-3xl border border-zinc-800 flex flex-wrap gap-2">
                {data.passives?.map(pId => (
                  <div key={pId} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 group">
                    <span className="text-yellow-600">⚡</span> {passivesData.find(p => p.id === pId)?.name || pId}
                    <button className="hidden group-hover:block text-red-800 ml-1" onClick={() => onUpdate({...data, passives: data.passives.filter(id => id !== pId)})}><Trash2 size={10}/></button>
                  </div>
                ))}
                <select className="bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] text-zinc-500 px-2 py-1" onChange={e => e.target.value && onUpdate({...data, passives: [...(data.passives || []), e.target.value]})}>
                  <option value="">+ 添加被动</option>
                  {passivesData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：战斗动作 */}
      <div className="mt-12 border-t border-zinc-800 pt-12 space-y-4">
        <div className="flex items-center gap-3">
          <Sword className="text-red-500" size={18} />
          <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">战斗动作 / Actions</h3>
        </div>
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-zinc-900/80 text-zinc-600 border-b border-zinc-800">
              <tr><th className="p-4">技能名称</th><th className="p-4">距离</th><th className="p-4">命中</th><th className="p-4">伤害与类型</th><th className="p-1"></th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {data.actions?.map((action, idx) => (
                <tr key={idx} className="group hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4"><input className="bg-transparent text-zinc-200 font-bold outline-none w-full" value={action.name} onChange={e => {
                    const next = [...data.actions]; next[idx].name = e.target.value; onUpdate({...data, actions: next});
                  }}/></td>
                  <td className="p-4 text-zinc-500"><input className="bg-transparent outline-none w-8" value={action.range} onChange={e => {
                    const next = [...data.actions]; next[idx].range = e.target.value; onUpdate({...data, actions: next});
                  }}/> ft.</td>
                  <td className="p-4 text-indigo-400">+<input className="bg-transparent outline-none w-6" value={action.hit} onChange={e => {
                    const next = [...data.actions]; next[idx].hit = e.target.value; onUpdate({...data, actions: next});
                  }}/></td>
                  <td className="p-4"><input className="bg-transparent text-red-400 font-bold w-full outline-none" value={action.damage} onChange={e => {
                    const next = [...data.actions]; next[idx].damage = e.target.value; onUpdate({...data, actions: next});
                  }}/></td>
                  <td className="p-1"><Trash2 size={14} className="text-zinc-800 cursor-pointer hover:text-red-500" onClick={() => onUpdate({...data, actions: data.actions.filter((_, i) => i !== idx)})}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="w-full py-4 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-600 text-[10px] font-bold uppercase tracking-widest"
            onClick={() => onUpdate({...data, actions: [...(data.actions || []), { name: "新招式", range: "5", hit: "0", damage: "1d8 (Type)" }]})}>+ 注入动作模块</button>
        </div>
      </div>
    </div>
  );
};