import React from 'react';
import { Plus, Trash2, Shield, Sword, Activity, Eye, AlertCircle } from "lucide-react";
import { SkillTemplate } from "@/types";
import { DAMAGE_TYPES_LIST, DAMAGE_TYPE_COLORS } from "@/constants/damage_types"; 
import { CONDITIONS_LIST } from "@/constants/conditions"; 

interface TechniqueEditorProps {
  data: SkillTemplate;
  onUpdate: (newData: SkillTemplate) => void;
}

export const TechniqueEditor: React.FC<TechniqueEditorProps> = ({ data, onUpdate }) => {
  
  // --- 1. 防御性数据初始化 ---
  // 如果 data.mechanics 不存在，提供一组默认值，防止渲染崩溃
  const mech = data.mechanics || {
    sp_cost: 0,
    check: "Attack vs AC",
    range: "0",
    Radius: "0",
    movement: "0",
    damage: [],
    conditions: []
  };

  const narr = data.narrative || { visual: "" };

  // --- 2. 核心更新逻辑 ---
  const updateMech = (key: string, value: any) => {
    onUpdate({
      ...data,
      mechanics: { ...mech, [key]: value }
    });
  };

  // 管理伤害数组
  const addDamage = () => {
    const newDmg = [...(mech.damage || []), { dice: "1D6", type: "force" }];
    updateMech('damage', newDmg);
  };

  const removeDamage = (index: number) => {
    const newDmg = (mech.damage || []).filter((_, i) => i !== index);
    updateMech('damage', newDmg);
  };

  // 管理状态数组
  const addCondition = () => {
    const newCond = [...(mech.conditions || []), { id: "stunned", dc_mod: 0 }];
    updateMech('conditions', newCond);
  };

  const removeCondition = (index: number) => {
    const newCond = (mech.conditions || []).filter((_, i) => i !== index);
    updateMech('conditions', newCond);
  };

  const getDamageColor = (type: string) => DAMAGE_TYPE_COLORS[type] || "#ADB5BD";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 描述编辑 (顶级字段) */}
      <section className="space-y-2">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Base Description / 基础描述</label>
        <textarea 
          className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-400 outline-none focus:border-indigo-500/50 transition-all resize-none"
          rows={3}
          value={data.description || ""}
          onChange={e => onUpdate({ ...data, description: e.target.value })}
        />
      </section>

      {/* 1. 核心数值配置 */}
      <section className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={12}/> SP Cost / 消耗
          </label>
          <input 
            type="number"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
            value={mech.sp_cost}
            onChange={e => updateMech('sp_cost', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Shield size={12}/> Check / 判定
          </label>
          <select 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
            value={mech.check}
            onChange={e => updateMech('check', e.target.value)}
          >
            <option value="Attack vs AC">AC (命中)</option>
            <option value="DC vs STR Save">STR (力量)</option>
            <option value="DC vs DEX Save">DEX (敏捷)</option>
            <option value="DC vs CON Save">CON (体质)</option>
            <option value="DC vs INT Save">INT (智力)</option>
            <option value="DC vs WIS Save">WIS (感知)</option>
            <option value="DC vs CHA Save">CHA (魅力)</option>
            <option value="Auto Hit">Auto Hit (必中)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Sword size={12}/> Move / 位移
          </label>
          <input 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono"
            placeholder="MOV * 1.5"
            value={mech.movement}
            onChange={e => updateMech('movement', e.target.value)}
          />
        </div>
      </section>

      {/* 2. 范围配置 */}
      <section className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Range / 射程</label>
          <input 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
            value={mech.range}
            onChange={e => updateMech('range', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Radius / 半径</label>
          <input 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
            value={mech.Radius}
            onChange={e => updateMech('Radius', e.target.value)}
          />
        </div>
      </section>

      {/* 3. 伤害与状态 (分两列) */}
      <div className="grid grid-cols-2 gap-8">
        {/* 伤害列 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Damage / 伤害</label>
            <button onClick={addDamage} className="text-indigo-400 hover:text-indigo-300"><Plus size={14}/></button>
          </div>
          <div className="space-y-2">
            {(mech.damage || []).map((dmg, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-mono text-emerald-500"
                  style={{ color: getDamageColor(dmg.type) }}
                  value={dmg.dice}
                  onChange={e => {
                    const newDmg = [...mech.damage];
                    newDmg[idx].dice = e.target.value;
                    updateMech('damage', newDmg);
                  }}
                />
                <select 
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[10px] uppercase font-bold"
                  style={{ color: getDamageColor(dmg.type) }}
                  value={dmg.type}
                  onChange={e => {
                    const newDmg = [...mech.damage];
                    newDmg[idx].type = e.target.value;
                    updateMech('damage', newDmg);
                  }}
                >
                  {DAMAGE_TYPES_LIST.map(t => (<option key={t.id} value={t.id} style={{ color: DAMAGE_TYPE_COLORS[t.id] }}>{t.name}</option>))}
                </select>
                <button onClick={() => removeDamage(idx)} className="text-zinc-600 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* 状态列 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conditions / 附加状态</label>
            <button onClick={addCondition} className="text-amber-500 hover:text-amber-400"><Plus size={14}/></button>
          </div>
          <div className="space-y-2">
            {(mech.conditions || []).map((cond, idx) => (
              <div key={idx} className="flex gap-2">
                <select 
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[10px] uppercase"
                  value={cond.type}
                  onChange={e => {
                    const newDmg = [...mech.damage];
                    newDmg[idx].type = e.target.value;
                    updateMech('damage', newDmg);
                  }}
                >
                  {CONDITIONS_LIST.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <input 
                  className="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-amber-500"
                  placeholder="DC±"
                  value={cond.dc_mod || 0}
                  onChange={e => {
                    const newCond = [...mech.conditions];
                    newCond[idx].dc_mod = parseInt(e.target.value) || 0;
                    updateMech('conditions', newCond);
                  }}
                />
                <button onClick={() => removeCondition(idx)} className="text-zinc-600 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. 视觉描述 */}
      <section className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-3">
        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <Eye size={12}/> Visual Narrative / 视觉基调
        </label>
        <input 
          className="w-full bg-transparent border-b border-indigo-500/20 py-2 text-sm outline-none focus:border-indigo-500 transition-all text-indigo-200 italic"
          placeholder="描述魂力流转的视觉表现..."
          value={narr.visual}
          onChange={e => onUpdate({ ...data, narrative: { ...narr, visual: e.target.value } })}
        />
      </section>

    </div>
  );
};