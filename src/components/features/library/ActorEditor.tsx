import React, { useMemo, useState } from 'react';
import { 
  User, Settings2, Shield, Zap, History, Package, Lock, 
  Plus, Sparkles, LockIcon, Sword, Trash2, Heart, Skull, BookOpen
} from "lucide-react";
import { Actor, Soul, LibraryItem, SoulSkill, Technique, SkillTemplate, MemoryEntry, SoulBone } from "@/types";
import { MBTI_LIST } from "@/constants/mbti";
import { ALIGNMENT_LIST } from "@/constants/alignments";
import { RACE_LIST } from "@/constants/race";
import { GENDER_LIST } from "@/constants/gender";
import { STATES_LIST} from "@/constants/states";
import { TRAITS_LIST } from "@/constants/traits";
import { ABILITIES_LIST } from "@/constants/abilities";
import { DAMAGE_TYPES_LIST, DAMAGE_TYPE_COLORS } from "@/constants/damage_types";
import { 
  TRUE_FORM_BOOST_MAP, getSoulTitle, SENSES_LIST, 
  SOUL_RING_STANDARDS, SPECIAL_RING_COLORS, getAutoColorByYear 
} from "@/constants/mechanics";
import { Badge } from "../../ui/Badge";
import { TraitPicker } from "../../ui/TraitPicker";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { IconButton } from "../../ui/IconButton";
import { Card } from "../../ui/Card";

interface ActorEditorProps {
  data: Actor;
  soulsData: Soul[];
  passivesData: LibraryItem[];
  itemsData: any[]; 
  bonesData: any[]; 
  techsData: SkillTemplate[];
  onUpdate: (newData: any) => void;
}

interface CompiledPassive {
  id: string;
  source: PassiveSource;
  isEditable: boolean;
  name: string;
  instance: any;
}

type TabType = 'Identity' | 'Abilities' | 'Traits' | 'Actions' | 'Chronicle' | 'Extras';
type PassiveSource = 'Self' | 'Boon' | 'Soul' | 'Bone' | 'Equip';

export const ActorEditor: React.FC<ActorEditorProps> = ({ data, soulsData, passivesData, techsData, itemsData, bonesData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Identity');
  const [showPicker, setShowPicker] = useState(false);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const level = data.growth.level;
  const ringCount = Math.min(Math.floor(level / 10), 9);
  const [activeSoulIdx, setActiveSoulIdx] = useState(0);

  const updateSpec = (key: string, value: any) => {
    onUpdate({ ...data, specs: { ...data.specs, [key as any]: value } });
  };

  const updateAbilities = (key: string, value: number) => {
    onUpdate({ ...data, abilities: { ...data.abilities, [key as any]: value } });
  };
  
  const updateBirthday = (key: 'day' | 'month' | 'year', value: number) => {
    onUpdate({
      ...data,
      specs: {
        ...data.specs,
        birthday: { ...data.specs.birthday, [key]: value }
      }
    });
  };

  const renderTabTrigger = (id: TabType, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 
        ${activeTab === id ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
    >
      {icon} {label}
    </button>
  );

  const handleSpiritSoulChange = (index: number, newSoulId: string) => {
    const newSpirits = [...data.specs.souls];
    newSpirits[index].soulId = newSoulId;
    updateSpec('spirits', newSpirits);
  };

  const removeSpirit = (index: number) => {
    const filtered = data.specs.souls.filter((_, idx) => idx !== index);
    updateSpec('spirits', filtered);
  };

  const abilityMax =
    level < 40 ? 20 :
    level < 70 ? 30 :
    level < 100 ? 40 : 50;

  const handleAbilityChange = (key: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(value, abilityMax));
    onUpdate({
      ...data,
      abilities: { ...data.abilities, [key]: clampedValue }
    });
  };

  const allPassives = useMemo<CompiledPassive[]>(() => {
    const collected: CompiledPassive[] = [];

    (data.traits_passives || []).forEach(id => {
      const p = passivesData.find(pd => pd.id === id);
      collected.push({ id, name: p?.name || id, source: 'Self', isEditable: true, instance: p});
    });

    (data.boon_passives || []).forEach(id => {
      const p = passivesData.find(pd => pd.id === id);
      collected.push({ id, name: p?.name || id, source: 'Boon' , isEditable: true, instance: p });
    });

    data.specs.souls.forEach(soul => {
      const soulData = soulsData.find(sd => sd.id === soul.soulId);
      if (soulData?.passives) {
        soulData.passives.forEach(pId => {
          const p = passivesData.find(pd => pd.id === pId);
          collected.push({ 
            id: pId, 
            name: p?.name || pId, 
            source: 'Soul', 
            isEditable: false, 
            instance: p 
          });
        });
      }
    });

    (data.inventory || []).filter(inv => inv.isEquipped).forEach(inv => {
      const itemData = itemsData.find(idat => idat.id === inv.id);
      itemData?.modifiers?.forEach((m: any) => {

      });

      if (itemData?.passiveIds) {
        itemData.passiveIds.forEach((pId: string) => {
          const p = passivesData.find(pd => pd.id === pId);
          collected.push({ id: pId, name: p?.name || pId, source: 'Equip', isEditable: false, instance: p });
        });
      }
    });

    (data.growth.soul_bones || []).forEach(bone => {
      const boneData = bonesData.find(bd => bd.id === bone.id);
      if (boneData?.passive_id) {
        const p = passivesData.find(pd => pd.id === boneData.passive_id);
        collected.push({ id: boneData.passive_id, name: p?.name || boneData.passive_id, source: 'Bone', isEditable: false, instance: p});
      }
    });

    return collected;
  }, [data, passivesData, itemsData, bonesData, ringCount]);

  const getStatModifier = (statId: string) => {
    return allPassives.reduce((total, pRef) => {
      const mod = pRef.instance?.modifiers?.find((m: any) => m.target === statId);
      return total + (mod?.value || 0);
    }, 0);
  };

  const updateSoulSkill = (soulId: string, order: number, updates: any) => {
    const currentSkills = [...(data.growth.soulSkills || [])];
    const idx = currentSkills.findIndex(s => s.soulId === soulId && s.order === order);

    // 整理要更新的数据块
    const skillData = typeof updates === 'object' ? updates : {};

    if (idx > -1) {
      // 存在则合并
      currentSkills[idx] = { ...currentSkills[idx], ...skillData };
    } else {
      // 不存在则创建（初始化插槽）
      currentSkills.push({
        soulId,
        order,
        skillId: "",
        name: "未命名魂技",
        description: "",
        year: 0,
        color: "white",
        source: "",
        ability: "STR",
        ...skillData
      });
    }
    
    onUpdate({ ...data, growth: { ...data.growth, soulSkills: currentSkills } });
  };

  const applyTemplateToSoulSkill = (soulId: string, order: number, templateId: string) => {
    const template = techsData.find(t => t.id === templateId);
    if (!template) return;

    const currentSkills = [...(data.growth.soulSkills || [])];
    const idx = currentSkills.findIndex(s => s.soulId === soulId && s.order === order);

    const baseData = {
      soulId,
      order,
      skillId: templateId,
      name: template.name,
      description: template.description,
      ability: "STR"
    };

    if (idx > -1) {
      currentSkills[idx] = { ...currentSkills[idx], ...baseData };
    } else {
      currentSkills.push({
        ...baseData,
        year: 0,
        color: "white",
        source: ""
      } as any);
    }

    onUpdate({ ...data, growth: { ...data.growth, soulSkills: currentSkills } });
  };

  const addNewTechnique = () => {
    const newTech = {
      skillId: "",
      name: "新武技",
      description: "点击下方选择模版或自行描述",
      ability: "STR"
    };
    onUpdate({
      ...data,
      growth: {
        ...data.growth,
        techniques: [...(data.growth.techniques || []), newTech]
      }
    });
  };

  const CHECK_LABELS: Record<string, string> = {
    "Attack vs AC": "ATK > AC",
    "DC vs STR Save": "DC > STR",
    "DC vs DEX Save": "DC > DEX",
    "DC vs CON Save": "DC > CON",
    "DC vs INT Save": "DC > INT",
    "DC vs WIS Save": "DC > WIS",
    "DC vs CHA Save": "DC > CHA",
    "Auto Hit": "PASS",
  };
  
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      
      <nav className="flex items-center border-b border-zinc-800/50 sticky top-[-64px] bg-[#131314] z-40 -mx-16 px-16 mb-8 h-16">
        {renderTabTrigger('Identity', <User size={14}/>, 'Identity')}
        {renderTabTrigger('Abilities', <Settings2 size={14}/>, 'Abilities')}
        {renderTabTrigger('Traits', <Shield size={14}/>, 'Traits')}
        {renderTabTrigger('Actions', <Zap size={14}/>, 'Combat')}
        {renderTabTrigger('Chronicle', <History size={14}/>, 'Memory')}
        {renderTabTrigger('Extras', <Package size={14}/>, 'Extras')}
      </nav>

      <main className="py-8 min-h-[700px] pt-4">
        
        {activeTab === 'Identity' && (
          <div className="grid grid-cols-12 gap-12">
            {/* 左侧：Biography */}
            <div className="col-span-5 space-y-4">
              <Label>人物介绍</Label>
              <textarea
                className="w-full h-[520px] bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] p-8 text-sm text-zinc-300 leading-relaxed outline-none focus:border-indigo-500/30 transition-all resize-none scrollbar-hide"
                value={data.description}
                onChange={e => onUpdate({...data, description: e.target.value})}
              />
            </div>

            {/* 右侧：基础信息 */}
            <div className="col-span-7 space-y-6">
              <Card className="p-1">
                <div className="grid grid-cols-12 gap-4 mb-2">
                  <div className="col-span-4 space-y-2">
                    <Label>性别</Label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 outline-none" value={data.specs.gender} onChange={e => updateSpec('gender', e.target.value)}>
                      {GENDER_LIST.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-8 space-y-2">
                    <Label>诞辰（d-m-y）</Label>
                    <div className="flex gap-1.5">
                      <select 
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-3 text-[10px] text-zinc-300 outline-none focus:border-indigo-500/50"
                        value={data.specs.birthday?.day || 1}
                        onChange={e => updateBirthday('day', parseInt(e.target.value))}
                      >
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select 
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-3 text-[10px] text-zinc-300 outline-none focus:border-indigo-500/50"
                        value={data.specs.birthday?.month || 1}
                        onChange={e => updateBirthday('month', parseInt(e.target.value))}
                      >
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <input 
                        type="number"
                        className="w-12 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-3 text-[10px] text-zinc-300 outline-none focus:border-indigo-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="年"
                        value={data.specs.birthday?.year || 1148}
                        onChange={e => updateBirthday('year', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="space-y-2">
                    <Label>种族</Label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 outline-none" value={data.specs.race} onChange={e => updateSpec('race', e.target.value)}>
                      {RACE_LIST.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>籍贯</Label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 outline-none" value={data.specs.birthplace} onChange={e => updateSpec('birthplace', e.target.value)}>
                      {STATES_LIST.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                  <Label> 势力 </Label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-300 outline-none"
                      value={data.specs.organization} onChange={e => updateSpec('organization', e.target.value)}>
                      <option value="">无</option>
                      {/* 这里可以 map orgsData */}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4 mb-2">
                  <div className="col-span-4 space-y-2">
                    <Label>人格类型</Label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 outline-none" value={data.specs.mbti} onChange={e => updateSpec('mbti', e.target.value)}>
                      {MBTI_LIST.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-8 space-y-2">
                    <div className="flex items-center justify-between">
                    <Label>性格特质</Label>
                    <button onClick={() => setShowPicker(true)} className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter hover:underline">配置特质</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.specs.traits.map(tId => (
                        <Badge key={tId} variant="square" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{TRAITS_LIST.find(t => t.id === tId)?.name || tId}</Badge>
                      ))}
                    </div>
                    {showPicker && <TraitPicker selectedTraits={data.specs.traits} onClose={() => setShowPicker(false)} onToggle={(id) => {
                        const exists = data.specs.traits.includes(id);
                        if (exists) updateSpec('traits', data.specs.traits.filter(t => t !== id));
                        else if (data.specs.traits.length < 4) updateSpec('traits', [...data.specs.traits, id]);
                    }} />}
                  </div>
                </div>
              </Card>

              <Card className="p-5 space-y-6">
                {/* 1. 等级与称号 (紧凑并排) */}
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-4 space-y-1.5">
                    <Label className="text-[10px] text-zinc-500 uppercase">魂力等级</Label>
                    <input 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-indigo-500/40"
                      value={level}
                      onChange={e => onUpdate({...data, growth: {...data.growth, level: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div className="col-span-8 space-y-1.5">
                    <Label className="text-[10px] text-zinc-500 uppercase">称号</Label>
                    <div className="h-[30px] flex items-center px-3 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-[10px] font-black text-indigo-400/80 uppercase tracking-widest">
                      {getSoulTitle(level)}
                    </div>
                  </div>
                </div>

                {/* 2. 武魂插槽区域 */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-zinc-500 uppercase">武魂</Label>
                    {data.specs.souls.length < 2 && (
                      <button 
                        onClick={() => updateSpec('spirits', [...data.specs.souls, { soulId: "", soulRings: [] }])}
                        className="text-[9px] font-black text-indigo-500/50 hover:text-indigo-400 transition-colors uppercase">+ 武魂
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {data.specs.souls.map((s, i) => (
                      <div key={i} className="group relative p-3 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl transition-all hover:border-zinc-700">
                        <div className="flex items-center gap-4">
                          {/* 下拉选择：武魂名 */}
                          <div className="w-1/3">
                            <select 
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-indigo-400/80 font-bold outline-none"
                              value={s.soulId}
                              onChange={(e) => handleSpiritSoulChange(i, e.target.value)}
                            >
                              <option value="">未绑定武魂 (SELECT...)</option>
                              {soulsData.map(soul => (
                                <option key={soul.id} value={soul.id}>{soul.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* 动态空槽位显示 */}
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex gap-1">
                              {Array.from({ length: 9 }).map((_, idx) => (
                                <div 
                                  key={idx} 
                                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all
                                    ${idx < ringCount 
                                      ? "border-zinc-700 bg-transparent opacity-100" 
                                      : "border-zinc-800/30 bg-zinc-900/20 opacity-20"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-indigo-400/80 uppercase">
                              {ringCount} Slots
                            </span>
                          </div>
                        </div>

                        {i > 0 && (
                          <button 
                            className="absolute top-2 right-2 text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => updateSpec('spirits', data.specs.souls.filter((_, idx) => idx !== i))}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'Abilities' && (
          <div className="grid grid-cols-12 gap-10 animate-in fade-in duration-500">
            
            {/* --- 左侧栏：核心属性 (6维 + AC + 移动) --- */}
            <div className="col-span-4 space-y-6">
              <div className="flex items-center gap-2 px-2 mb-2">
                <div className="w-1 h-3 bg-indigo-500" />
                <Label className="text-zinc-500 uppercase text-[10px] tracking-widest">Core Attributes</Label>
              </div>

              <Card className="p-4 space-y-1">
                {/* 表头 */}
                <div className="grid grid-cols-12 gap- px-0。5 mb-2 text-[9px] font-black text-zinc-600 uppercase">
                  <div className="col-span-3">Ability</div>
                  <div className="col-span-4 text-center">Base</div>
                  <div className="col-span-2 text-center">Mod</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {/* 6维列表 */}
                {ABILITIES_LIST.map(abi => {
                  const base = (data.abilities as any)[abi.id] ?? 10;
                  const mod = getStatModifier(abi.id);
                  const total = base + mod;

                  return (
                    <div key={abi.id} className="grid grid-cols-12 gap-2 items-center px-0.5 py-1.5 hover:bg-white/5 rounded-lg transition-colors group">
                      <div className="col-span-3 flex flex-col">
                        <span className="text-xs font-bold text-zinc-300">{abi.name}</span>
                        <span className="text-[9px] text-zinc-600 font-mono uppercase">{abi.id}</span>
                      </div>
                      <div className="col-span-4">
                        <input 
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-center text-white outline-none focus:border-indigo-500/50"
                          value={base}
                          onChange={e => handleAbilityChange(abi.id, parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 text-center text-[10px] font-bold text-emerald-500/80">
                        {mod > 0 ? `+${mod}` : mod < 0 ? mod : '-'}
                      </div>
                      <div className={`col-span-3 text-right text-sm font-black ${mod !== 0 ? 'text-indigo-400' : 'text-zinc-400'}`}>
                        {total}
                      </div>
                    </div>
                  );
                })}

                {/* AC 与 移动力 (同样的格式) */}
                <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-1">
                  {[
                    { id: 'AC', name: '豁免' },
                    { id: 'MOV', name: '移动' }
                  ].map(stat => {
                    const base = (data.abilities as any)[stat.id] || 10;
                    const mod = getStatModifier(stat.id);
                    return (
                      <div key={stat.id} className="grid grid-cols-12 gap-2 items-center px-0.5 py-1.5">
                        <div className="col-span-3 text-xs font-bold text-zinc-500">{stat.name}</div>
                        <div className="col-span-4">
                          <input 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-center text-white outline-none focus:border-indigo-500/50"
                            value={base}
                            onChange={e => onUpdate({...data, abilities: {...data.abilities, [stat.id]: parseInt(e.target.value) || 0}})}
                          />
                        </div>
                        <div className="col-span-2 text-center text-[10px] font-bold text-emerald-500/80">{mod > 0 ? `+${mod}` : '-'}</div>
                        <div className="col-span-3 text-right text-sm font-black text-zinc-400">{base + mod}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* --- 右侧栏：状态值 + 抗性 --- */}
            <div className="col-span-8 space-y-8">
              
              {/* 1. HP / SP 状态区 */}
              <div className="grid grid-cols-2 gap-6">
                {/* HP Card */}
                <Card className="p-5 border-l-4 border-l-red-600/50 bg-red-600/5">
                  <div className="flex justify-between items-start mb-4">
                    <Label className="text-red-500/80 text-[10px] tracking-widest uppercase">HP</Label>
                    <span className="text-[9px] text-zinc-600 font-mono">Regen: +{data.abilities.HP_REGEN || 0}/s</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <input 
                      type="number"
                      className="bg-transparent text-4xl font-black text-white outline-none w-32"
                      value={data.abilities.HP || 100}
                      onChange={e => onUpdate({...data, abilities: {...data.abilities, HP: parseInt(e.target.value)}})}
                    />
                    <span className="text-zinc-700 text-lg font-bold pb-1">MAX</span>
                  </div>
                </Card>

                {/* SP Card */}
                <Card className="p-5 border-l-4 border-l-indigo-600/50 bg-indigo-600/5">
                  <div className="flex justify-between items-start mb-4">
                    <Label className="text-indigo-500/80 text-[10px] tracking-widest uppercase">SP</Label>
                    <span className="text-[9px] text-zinc-600 font-mono">Regen: +{data.abilities.SP_REGEN || 0}/s</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <input 
                      type="number"
                      className="bg-transparent text-4xl font-black text-white outline-none w-32"
                      value={data.abilities.SP || 100}
                      onChange={e => onUpdate({...data, abilities: {...data.abilities, SP: parseInt(e.target.value)}})}
                    />
                    <span className="text-zinc-700 text-lg font-bold pb-1">MAX</span>
                  </div>
                </Card>
              </div>

              {/* 2. 损害抗性区 (Resistances) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-1 h-3 bg-amber-500" />
                  <Label className="text-zinc-500 uppercase text-[10px] tracking-widest">Damage Resistances / 损害抗性</Label>
                </div>
                
                <Card className="p-6">
                  <div className="grid grid-cols-4 gap-y-6 gap-x-8">
                    {DAMAGE_TYPES_LIST.map(type => {
                      // 抗性基础值固定为 0，只计算被动修正
                      const resMod = getStatModifier(`RES_${type.id}`);
                      
                      return (
                        <div key={type.id} className="flex flex-col gap-1 border-l border-zinc-800 pl-3">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{type.name}</span>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-mono font-black ${resMod > 0 ? 'text-amber-500' : 'text-zinc-800'}`}>
                              {resMod}%
                            </span>
                            {resMod > 0 && <span className="text-[8px] text-amber-500/50 animate-pulse italic">MODIFIED</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* 3. Senses 感官区 (自动感知) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-1 h-3 bg-indigo-500" />
                  <Label className="text-zinc-500 uppercase text-[10px] tracking-widest">Senses / 感官感知</Label>
                </div>
                
                <Card className="p-6">
                  {/* 过滤出当前角色拥有的感官 */}
                  {(() => {
                    const activeSenses = SENSES_LIST.map(sense => ({
                      ...sense,
                      value: getStatModifier(sense.id) // 使用我们之前的通用修正计算函数
                    })).filter(s => s.value > 0);

                    if (activeSenses.length === 0) {
                      return (
                        <div className="h-16 flex items-center justify-center border border-dashed border-zinc-800/50 rounded-2xl text-[10px] font-bold text-zinc-700 tracking-widest uppercase">
                          无特殊感官 (常规视觉)
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-4 gap-4">
                        {activeSenses.map(sense => (
                          <div key={sense.id} className="relative group p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex flex-col items-center gap-1">
                            {/* 装饰：右上角来源标记 */}
                            <div className="absolute top-2 right-2 flex gap-1">
                              {allPassives
                                .filter(ap => {
                                  const p = passivesData.find(pd => pd.id === ap.id);
                                  return p?.modifiers?.some((m: any) => m.target === sense.id);
                                })
                                .map((ap, i) => (
                                  <div key={i} title={`来源: ${ap.source}`} className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                ))
                              }
                            </div>

                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{sense.name}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-mono font-black text-indigo-400">
                                {sense.value}
                              </span>
                              <span className="text-[10px] font-bold text-zinc-700">{sense.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Traits' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <Label className="text-zinc-500 uppercase text-[10px] tracking-[0.2em]">Ability Passives / 综合被动列表</Label>
                <span className="text-[9px] font-mono text-zinc-700 italic">SYSTEM LINKED & SELF ACQUIRED</span>
              </div>

              {allPassives.map((p, idx) => (
                <div key={`${p.id}-${idx}`} className="group relative flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl transition-all hover:bg-zinc-900/50 hover:border-zinc-700">
                  
                  {/* 来源标签 */}
                  <div className={`w-16 text-center py-1 rounded text-[8px] font-black uppercase tracking-tighter
                    ${p.source === 'Self' ? 'bg-zinc-800 text-zinc-400' : 
                      p.source === 'Boon' ? 'bg-indigo-500/20 text-indigo-400' :
                      p.source === 'Soul' ? 'bg-blue-500/20 text-emerald-500' : 
                      p.source === 'Equip' ? 'bg-amber-500/20 text-amber-500' : 
                      p.source === 'Bone' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {p.source === 'Self' ? '自身' : p.source === 'Boon' ? '赐福' : p.source === 'Soul' ? '武魂' : p.source === 'Equip' ? '装备' : p.source === 'Bone' ? '魂骨' : '未知'}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-bold text-zinc-200">{p.name}</div>
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-tight">{p.id}</div>
                  </div>

                  {/* --- 悬停描述弹窗 (Tooltip) --- */}
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
                    <div className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest border-b border-zinc-800 pb-1">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-relaxed italic">
                      {p.instance?.description || "暂无描述信息..."}
                    </div>
                    {/* 如果有数值修正，也一并显示出来 */}
                    {p.instance?.modifiers?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.instance.modifiers.map((m: any, i: number) => (
                          <span key={i} className="text-[8px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-emerald-500 font-mono">
                            {m.target}: {m.value > 0 ? `+${m.value}` : m.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* 装饰小箭头 */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-950" />
                  </div>

                  {/* 操作按钮 (Trash/Lock) */}
                  {p.isEditable ? (
                    <button 
                      className="p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => {
                        const listKey = p.source === 'Self' ? 'traits_passives' : 'boon_passives';
                        onUpdate({ ...data, [listKey]: (data[listKey] as string[]).filter(id => id !== p.id) });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <LockIcon size={12} className="text-zinc-800 mr-2" />
                  )}
                </div>
              ))}

              {/* 3. 被动添加区 (放在列表末尾) */}
              <div className="pt-4 mt-4 border-t border-zinc-800/50">
                <div className="bg-zinc-950/50 border border-dashed border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-[9px] font-black text-zinc-700 uppercase min-w-[64px]">New Passive</div>
                  
                  <select 
                    className="flex-1 bg-transparent text-xs text-zinc-500 outline-none focus:text-indigo-400 transition-colors"
                    value=""
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId && !data.traits_passives.includes(selectedId)) {
                        onUpdate({ ...data, traits_passives: [...data.traits_passives, selectedId] });
                      }
                    }}
                  >
                    <option value="">从库中选择被动特性...</option>
                    {passivesData
                      .filter(p => !allPassives.some(ap => ap.id === p.id)) // 过滤已有的
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))
                    }
                  </select>

                  <div className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-700">
                    <Plus size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Actions' && (
          /* 三：修复双列布局，使用 grid-cols-2 */
          <div className="grid grid-cols-2 gap-10 animate-in fade-in duration-500 pb-20">
            
            {/* --- 左侧：魂环技 (Soul Skills) --- */}
            <div className="space-y-6">
              {/* 二：选择武魂界面 */}
              <div className="flex items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Soul / 当前武魂</div>
                  <select 
                    className="bg-zinc-950 text-xs font-bold text-indigo-400 px-3 py-1 rounded-lg border border-zinc-800 outline-none"
                    value={activeSoulIdx}
                    onChange={(e) => setActiveSoulIdx(parseInt(e.target.value))}
                  >
                    {data.specs.souls.map((s, idx) => (
                      <option key={idx} value={idx}>
                        {soulsData.find(sd => sd.id === s.soulId)?.name || `武魂 ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {data.specs.souls[activeSoulIdx]?.soulRings.map((ringColor, rIdx) => {
                  const order = rIdx + 1;
                  const currentSoulId = data.specs.souls[activeSoulIdx].soulId;
                  const skill = data.growth.soulSkills.find(s => s.soulId === currentSoulId && s.order === order);

                  return (
                    <div key={rIdx} className="p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* 环颜色指示器 */}
                          <div className={`w-3 h-3 rounded-full shadow-lg transition-all duration-500 ${
                            ringColor === 'white' ? 'bg-zinc-100' :
                            ringColor === 'yellow' ? 'bg-yellow-400' :
                            ringColor === 'purple' ? 'bg-purple-500' :
                            ringColor === 'black' ? 'bg-zinc-900 border border-zinc-600' : 
                            ringColor === 'red' ? 'bg-red-500 animate-pulse' : `bg-${ringColor}-500` // 适配特殊色
                          }`} />
                          <span className="text-[10px] font-black text-zinc-600 uppercase">Ring #0{order}</span>
                        </div>
                        
                        {/* 一：颜色联动与特殊颜色选择 */}
                        <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            className="bg-zinc-950/50 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono w-20 outline-none focus:border-indigo-500"
                            placeholder="年限"
                            value={skill?.year || 0}
                            onChange={(e) => {
                              const year = parseInt(e.target.value) || 0;
                              // 1. 获取自动颜色
                              const autoColor = getAutoColorByYear(year);
                              // 2. 更新魂技实例
                              updateSoulSkill(currentSoulId, order, { year, color: autoColor });
                              // 3. 同步到 Identity (specs.souls)
                              const newSouls = [...data.specs.souls];
                              newSouls[activeSoulIdx].soulRings[rIdx] = autoColor;
                              onUpdate({ ...data, specs: { ...data.specs, souls: newSouls } });
                            }}
                          />
                          <select 
                            className="bg-transparent text-[9px] text-zinc-500 outline-none"
                            value={ringColor}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              // 手动覆盖颜色逻辑
                              const newSouls = [...data.specs.souls];
                              newSouls[activeSoulIdx].soulRings[rIdx] = newColor;
                              updateSoulSkill(currentSoulId, order, { color: newColor });
                              onUpdate({ ...data, specs: { ...data.specs, souls: newSouls } });
                            }}
                          >
                            <option value="">手动修正颜色...</option>
                            {[...SOUL_RING_STANDARDS, ...SPECIAL_RING_COLORS].map(c => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 四：魂技选择面板 */}
                      <div className="grid grid-cols-[1fr_80px] gap-3">
                        <select 
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold text-zinc-300 outline-none"
                          value={skill?.skillId || ""}
                          onChange={(e) => applyTemplateToSoulSkill(currentSoulId, order, e.target.value)}
                        >
                          <option value="">选择技能模版 (Skill Template)...</option>
                          {techsData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <select 
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] text-indigo-400 font-mono outline-none"
                          value={skill?.ability || "STR"}
                          onChange={(e) => updateSoulSkill(currentSoulId, order, { ability: e.target.value })}
                        >
                          {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>

                      {/* 五：魂力消耗与数据预览 */}
                      {techsData.find(t => t.id === skill?.skillId) && (
                        <div className="flex gap-4 px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-zinc-700 uppercase">SP:</span>
                            <span className="text-[10px] font-mono text-emerald-500 font-bold">
                              {techsData.find(t => t.id === skill?.skillId)?.mechanics.sp_cost}
                            </span>
                          </div>
                          {/* 这里的其他预览代码保持之前的伤害颜色逻辑 */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- 右侧：自创武技 (Techniques) --- */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Self Techniques / 自创武技</Label>
                <button 
                  onClick={addNewTechnique}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                ><Plus size={16}/></button>
              </div>

              <div className="space-y-4">
                {data.growth.techniques.map((tech, idx) => (
                  <div key={idx} className="p-5 bg-zinc-900/10 border border-zinc-800/40 rounded-3xl space-y-3">
                    {/* 四：武技的选择面板 */}
                    <div className="flex gap-3">
                      <select 
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-bold outline-none"
                        value={tech.skillId}
                        onChange={(e) => {
                          const tpl = techsData.find(t => t.id === e.target.value);
                          const newTechs = [...data.growth.techniques];
                          newTechs[idx] = { ...newTechs[idx], skillId: e.target.value, name: tpl?.name || "", description: tpl?.description || "" };
                          onUpdate({ ...data, growth: { ...data.growth, techniques: newTechs } });
                        }}
                      >
                        <option value="">绑定模版...</option>
                        {techsData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <select 
                        className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] text-indigo-400 outline-none"
                        value={tech.ability}
                        onChange={(e) => {
                          const newTechs = [...data.growth.techniques];
                          newTechs[idx].ability = e.target.value;
                          onUpdate({ ...data, growth: { ...data.growth, techniques: newTechs } });
                        }}
                      >
                        {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    {/* 名/描述/SP 显示逻辑同左侧 */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Chronicle' && (
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-zinc-800">
            {data.memoryStream.map((mem) => (
              <div key={mem.id} className="relative pl-12 group">
                 <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-[#131314]
                    ${mem.type === 'core' ? 'bg-indigo-600 text-white' : 
                      mem.type === 'buffer' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    {mem.type === 'core' ? <Skull size={14}/> : mem.type === 'buffer' ? <Heart size={14}/> : <BookOpen size={14}/>}
                 </div>
                 <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[24px]">
                    <div className="flex items-center gap-4 mb-4">
                       <span className="text-xs font-mono text-zinc-600">T{mem.timestamp > 0 ? '+' : ''}{mem.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-2">
                          <Label>Event</Label>
                          <p className="text-sm text-zinc-200 leading-relaxed">{mem.event}</p>
                       </div>
                       <div className="space-y-2 border-l border-zinc-800 pl-10">
                          <Label>Impact</Label>
                          <p className="text-xs text-zinc-500 italic">{mem.impact}</p>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Extras' && (
          <div className="grid grid-cols-2 gap-12">
             <div className="space-y-6">
                <Label>Inventory / 物品清单 (ID 引用)</Label>
                <div className="grid grid-cols-1 gap-2">
                   {data.inventory.map((invId, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <span className="text-xs font-mono text-zinc-400">{invId.id}</span>
                        <IconButton icon={<Trash2 size={12}/>} onClick={() => onUpdate({...data, inventory: data.inventory.filter(i => i !== invId)})} />
                     </div>
                   ))}
                </div>
             </div>
             {data.snapshot && (
               <div className="space-y-6">
                 <Label>Real-time Snapshot / 实时快照</Label>
                 <Card>
                    <div className="space-y-6">
                       <Input label="Physical Status" value={data.snapshot.physicalStatus} onChange={e => onUpdate({...data, snapshot: {...data.snapshot!, physicalStatus: e.target.value}})} />
                       <Input label="Mental Status" value={data.snapshot.mentalStatus} onChange={e => onUpdate({...data, snapshot: {...data.snapshot!, mentalStatus: e.target.value}})} />
                       <Input label="Location" value={data.snapshot.currentLocation} onChange={e => onUpdate({...data, snapshot: {...data.snapshot!, currentLocation: e.target.value}})} />
                    </div>
                 </Card>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};