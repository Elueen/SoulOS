// src/components/features/library/SoulEditor.tsx
import React from 'react';
import { Zap, Sword, Trash2, Sparkles, Hash, Plus} from "lucide-react";
import { Soul, LibraryItem, Action } from "../../../types"; 
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Card } from "../../ui/Card";
import { Label } from "../../ui/Label";
import { Badge } from "../../ui/Badge";    
import { Textarea } from "../../ui/Textarea"; 
import { IconButton } from "../../ui/IconButton";

interface SoulEditorProps {
  data: Soul;
  passivesData: LibraryItem[];
  tagsData: LibraryItem[];
  onUpdate: (newData: any) => void;
}

export const SoulEditor: React.FC<SoulEditorProps> = ({ data, passivesData, tagsData, onUpdate }) => {
  return (
    <div className="space-y-12 pb-32">
      <div className="grid grid-cols-2 gap-16">
        
        {/* 左侧：描述 */}
        <div className="space-y-8">
          <Select 
            label="武魂种类"
            value={data.category || "Apparatus"}
            options={[
              { value: "Apparatus", label: "器武魂" },
              { value: "Beast", label: "兽武魂" },
              { value: "Body", label: "本体武魂" },
              { value: "Other", label: "其他" }
            ]}
            onChange={e => onUpdate({...data, category: e.target.value})}
          />

          <Textarea 
            label="武魂描述"
            className="h-[400px]"
            value={data.description} 
            onChange={e => onUpdate({...data, description: e.target.value})} 
          />
        </div>

        {/* 右侧：真身 + 特性 + 标签 */}
        <div className="space-y-4">
          <Label className="text-amber-600 mb-2 flex items-center gap-2">武魂真身</Label>
          <Card className="p-1"> 
            <div className="space-y-3">
              <div className="space-y-1">
                <Input 
                  className="text-lg font-bold bg-transparent border-b border-zinc-800 rounded-none p-0 h-8 focus:border-amber-600/50" 
                  placeholder="真身名称"
                  value={data.true_form?.name || ""} 
                  onChange={e => onUpdate({
                    ...data, 
                    true_form: { ...(data.true_form || {}), name: e.target.value }
                  })} 
                />
              </div>

              <div className="relative">
                <Textarea 
                  placeholder="输入技能描述"
                  className="h-40 text-xs p-2 bg-zinc-950/30 border-zinc-800 leading-relaxed resize-none" 
                  value={data.true_form?.description || ""} 
                  onChange={e => onUpdate({
                    ...data, 
                    true_form: { ...(data.true_form || {}), description: e.target.value }
                  })}
                />
              </div>
            </div>
          </Card>

          {/* 被动特性：使用 Badge 组件 */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2"><Zap size={14} className="text-yellow-600" /> 被动特性</Label>
            <div className="bg-zinc-900/20 p-4 rounded-3xl border border-zinc-800 flex flex-wrap gap-2">
              {data.passives?.map((pId: string) => (
                <Badge 
                  key={pId} 
                  icon={<Zap size={10} className="text-yellow-600" />}
                  onDelete={() => onUpdate({...data, passives: data.passives.filter((id: string) => id !== pId)})}
                >
                  {passivesData.find(p => p.id === pId)?.name || pId}
                </Badge>
              ))}
              <select className="bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] text-zinc-500 px-2 py-1 outline-none" 
                onChange={e => e.target.value && onUpdate({...data, passives: [...(data.passives || []), e.target.value]})}>
                <option value="">+ 添加特性</option>
                {passivesData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* 关联逻辑：使用 Badge 组件 (pill 变体) */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2"><Hash size={14} className="text-emerald-600" /> 关联逻辑</Label>
            <div className="flex flex-wrap gap-2">
              {data.tags?.map((tagId: string) => (
                <Badge 
                  key={tagId} 
                  variant="pill"
                  onDelete={() => onUpdate({...data, tags: data.tags.filter((t:string) => t !== tagId)})}
                >
                  #{tagsData.find(t => t.id === tagId)?.name || tagId}
                </Badge>
              ))}
              <select className="bg-transparent border border-zinc-800 rounded-full text-[10px] text-zinc-600 px-3 py-1 outline-none"
                onChange={e => {
                  if (e.target.value && !data.tags?.includes(e.target.value)) {
                    onUpdate({...data, tags: [...(data.tags || []), e.target.value]});
                  }
                }}>
                <option value="">+ 添加标签</option>
                {tagsData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* --- 战斗动作面板 --- */}
      <div className="mt-12 border-t border-zinc-800 pt-12 space-y-6">
        <div className="flex items-center gap-3">
          <Sword className="text-red-600" size={18} />
          <Label className="mb-0 text-sm tracking-[0.4em]">Combat Actions / 战斗动作</Label>
        </div>
        
        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-zinc-900/80 text-zinc-600 border-b border-zinc-800/50">
              <tr>
                <th className="p-4 pl-6 uppercase tracking-widest font-black">Action Name</th>
                <th className="p-4 uppercase tracking-widest font-black">Range</th>
                <th className="p-4 uppercase tracking-widest font-black">Hit</th>
                <th className="p-4 uppercase tracking-widest font-black">Damage</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {data.actions?.map((action: Action, idx: number) => (
                <tr key={idx} className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="p-2 pl-6">
                    <input 
                      className="bg-transparent text-zinc-200 font-bold outline-none w-full border-b border-transparent focus:border-indigo-900/30 py-2 transition-all" 
                      value={action.name} 
                      onChange={e => {
                        const next = [...data.actions]; 
                        next[idx].name = e.target.value; 
                        onUpdate({...data, actions: next});
                      }}
                    />
                  </td>
                  <td className="p-2 text-zinc-500">
                    <div className="flex items-center gap-1">
                      <input className="bg-transparent outline-none w-8 text-right font-bold" value={action.range} 
                        onChange={e => {
                          const next = [...data.actions]; next[idx].range = e.target.value; onUpdate({...data, actions: next});
                        }}/> 
                      <span className="text-[9px] opacity-30 uppercase">ft.</span>
                    </div>
                  </td>
                  <td className="p-2 text-indigo-400 font-bold">
                    <div className="flex items-center">
                      <span className="opacity-50">+</span>
                      <input className="bg-transparent outline-none w-6" value={action.hit} 
                        onChange={e => {
                          const next = [...data.actions]; next[idx].hit = e.target.value; onUpdate({...data, actions: next});
                        }}/>
                    </div>
                  </td>
                  <td className="p-2">
                    <input className="bg-transparent text-red-400 font-bold w-full outline-none" value={action.damage} 
                      onChange={e => {
                        const next = [...data.actions]; next[idx].damage = e.target.value; onUpdate({...data, actions: next});
                      }}/>
                  </td>
                  <td className="p-2 pr-4 text-right">
                    <IconButton 
                      icon={<Trash2 size={14} />} 
                      variant="danger"
                      onClick={() => onUpdate({...data, actions: data.actions.filter((_, i: number) => i !== idx)})}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            className="w-full py-5 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
            onClick={() => onUpdate({...data, actions: [...(data.actions || []), { name: "新招式", range: "5", hit: "0", damage: "1d8 (Type)" }]})}
          >
            <Plus size={14} /> 注入战斗动作模块
          </button>
        </div>
      </div>
    </div>
  );
};