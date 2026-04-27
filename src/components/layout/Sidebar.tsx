import React, { useMemo } from 'react';
import { 
  Book, Shield, Zap, Hash, Plus, Search, User, 
  Building2, Sword, Package, Bone,
  ChevronRight, ChevronDown, Save, Loader2 
} from "lucide-react";
import { Actor, Soul, LibraryItem, Organization, Technique,SkillTemplate, Item, SoulBone } from "@/types";

interface SidebarProps {
  activeTab: { type: string; id: string; path: string };
  setActiveTab: (tab: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedMenus: string[];
  toggleMenu: (menu: string) => void;
  isSaving: boolean;
  
  // 基础数据
  volumes: any[];
  soulsData: Soul[];
  passivesData: LibraryItem[];
  tagsData: LibraryItem[];
  actorsData: Actor[];

  // 扩展档案库数据
  orgsData: Organization[];
  techsData: SkillTemplate[]
  itemsData: Item[];
  bonesData: SoulBone[];
  
  loadFileContent: (path: string) => void;
  createNewEntity: (type: any) => void;
  handleGlobalSave: () => void;
  setLibData: (data: any[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, searchQuery, setSearchQuery, 
  expandedMenus, toggleMenu, isSaving,
  volumes, soulsData, passivesData, tagsData, actorsData,
  orgsData, techsData, itemsData, bonesData,
  loadFileContent, createNewEntity, handleGlobalSave, setLibData
}) => {

  // --- 增强型过滤逻辑：涵盖所有 8 个档案库 ---
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filterFn = (item: any) => 
      item.name?.toLowerCase().includes(q) || 
      item.id?.toLowerCase().includes(q);
    
    return {
      actors: actorsData.filter(filterFn),
      souls: soulsData.filter(filterFn),
      tags: tagsData.filter(filterFn),
      passives: passivesData.filter(filterFn),
      orgs: orgsData.filter(filterFn),
      techs: techsData.filter(filterFn),
      items: itemsData.filter(filterFn),
      bones: bonesData.filter(filterFn)
    };
  }, [searchQuery, soulsData, tagsData, actorsData, orgsData, techsData, itemsData, bonesData, passivesData]);

  // 通用菜单项渲染：支持自定义图标颜色与数据源同步
  const renderMenuSection = (
    type: string, 
    icon: React.ReactNode, 
    label: string, 
    rawData: any[], 
    filteredData: any[],
    iconColor: string = "text-zinc-400"
  ) => (
    <div className="space-y-1">
      <button 
        onClick={() => toggleMenu(type)} 
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800/50 rounded-lg text-zinc-400 group transition-colors"
      >
        <div className="flex items-center gap-3 font-bold text-[10px] tracking-widest uppercase">
          <span className={`${iconColor} transition-transform group-hover:scale-110`}>{icon}</span>
          {label}
        </div>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${expandedMenus.includes(type) ? "" : "-rotate-90"}`} 
        />
      </button>
      
      {expandedMenus.includes(type) && (
        <div className="ml-4 mt-1 space-y-1 px-2 border-l border-zinc-800/30 animate-in slide-in-from-left-2 duration-200">
          {/* 快捷操作区 */}
          <div className="flex items-center gap-2 mb-2 ml-2 py-1">
            <Plus 
              size={14} 
              className="text-zinc-600 hover:text-emerald-500 cursor-pointer transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                createNewEntity(type);
              }} 
            />
            <span className="text-[9px] text-zinc-700 uppercase font-black tracking-tighter">Add New Entry</span>
          </div>
          
          {/* 渲染过滤后的列表项 */}
          {filteredData.map(item => (
            <button 
              key={item.id} 
              onClick={() => { 
                setActiveTab({ type, id: item.id, path: '' }); 
                setLibData(rawData); 
              }} 
              className={`w-full text-left px-3 py-1.5 text-xs rounded-md truncate transition-all duration-200
                ${activeTab.id === item.id && activeTab.type === type 
                  ? "text-white bg-indigo-600/20 border-r-2 border-indigo-500" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`}
            >
              {item.name || item.id}
            </button>
          ))}
          
          {filteredData.length === 0 && (
            <div className="text-[9px] text-zinc-800 py-2 ml-3 italic">未找到匹配项</div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-[#1e1f20] flex flex-col border-r border-zinc-800 shadow-2xl shrink-0 h-full overflow-hidden">
      {/* 顶部 Logo 区 */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/50 h-16 bg-[#1e1f20]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase">SoulOS</span>
          <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">Pro Studio v2.6</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-hide">
        
        {/* --- 1. 小说卷目索引 --- */}
        <div className="mb-4">
          <button onClick={() => toggleMenu('novel')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-lg text-zinc-400 group">
            <div className="flex items-center gap-3 font-bold text-[10px] tracking-widest uppercase"><Book size={14} className="text-zinc-500"/> 卷目索引 / Volumes</div>
            <ChevronDown size={14} className={`transition-transform ${expandedMenus.includes('novel') ? "" : "-rotate-90"}`} />
          </button>
          {expandedMenus.includes('novel') && volumes.map(vol => (
            <div key={vol.id} className="ml-4 mt-2 border-l border-zinc-800/50">
              <div className="px-3 py-1 text-[9px] text-zinc-600 font-black uppercase tracking-widest">{vol.id}</div>
              {vol.chapters.map((ch: any) => (
                <button key={ch} onClick={() => { setActiveTab({type:'novel', id: ch, path: `${vol.id}/${ch}`}); loadFileContent(`${vol.id}/${ch}`); }} 
                  className={`w-full text-left px-4 py-1.5 rounded-md truncate text-xs transition-colors
                    ${activeTab.id === ch && activeTab.type === 'novel' 
                      ? "text-indigo-400 bg-indigo-500/5 font-bold" 
                      : "text-zinc-500 hover:text-zinc-300"}`}>
                  {ch.replace('.md', '')}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="h-px bg-zinc-800/50 my-6 mx-2" />

        {/* --- 2. 全球搜索与过滤 --- */}
        <div className="px-3 mb-6">
           <div className="relative group">
            <Search size={12} className="absolute left-3 top-2.5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-[10px] outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700" 
              placeholder="SEARCH ACROSS WORLD..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        {/* --- 3. 核心数据库组 (按逻辑优先级排列) --- */}
        {renderMenuSection('actor', <User size={14}/>, '人物档案 / Actors', actorsData, filtered.actors, "text-rose-400")}
        {renderMenuSection('organization', <Building2 size={14}/>, '势力组织 / Groups', orgsData, filtered.orgs, "text-amber-500")}
        
        <div className="h-4" /> {/* 视觉间隔 */}
        
        {renderMenuSection('soul', <Shield size={14}/>, '武魂百科 / Souls', soulsData, filtered.souls, "text-blue-500")}
        {renderMenuSection('technique', <Sword size={14}/>, '技艺绝学 / Skills', techsData, filtered.techs, "text-indigo-400")}
        {renderMenuSection('souls_bone', <Bone size={14}/>, '魂骨收藏 / Bones', bonesData, filtered.bones, "text-zinc-100")}
        {renderMenuSection('item', <Package size={14}/>, '库藏物品 / Items', itemsData, filtered.items, "text-emerald-400")}
        
        <div className="h-4" /> {/* 视觉间隔 */}
        
        {renderMenuSection('passive', <Zap size={14}/>, '被动特性 / Passives', passivesData, filtered.passives, "text-yellow-500")}
        {renderMenuSection('tag', <Hash size={14}/>, '逻辑标签 / Tags', tagsData, filtered.tags, "text-emerald-500")}

      </div>

      {/* 底部同步按钮 */}
      <div className="p-4 border-t border-zinc-800 bg-[#1e1f20] z-10">
        <button 
          onClick={handleGlobalSave} 
          disabled={isSaving} 
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-2xl flex flex-col items-center gap-1 transition-all text-white shadow-lg active:scale-95 group"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:animate-bounce" />}
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isSaving ? "SYNCING..." : "同步位面文件"}</span>
        </button>
      </div>
    </div>
  );
};