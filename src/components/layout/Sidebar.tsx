import React from 'react';
import { 
  Book, Shield, Zap, Hash, Plus, Search, 
  ChevronDown, Save, Loader2 
} from "lucide-react";
import { Soul, LibraryItem } from "@/types";

interface SidebarProps {
  // 状态与基础属性
  activeTab: { type: string; id: string; path: string };
  setActiveTab: (tab: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedMenus: string[];
  toggleMenu: (menu: string) => void;
  isSaving: boolean;
  
  // 数据源
  volumes: any[];
  soulsData: Soul[];
  passivesData: LibraryItem[];
  tagsData: LibraryItem[];
  
  // 方法回调
  loadFileContent: (path: string) => void;
  createNewEntity: (type: 'soul' | 'tag' | 'passive') => void;
  handleGlobalSave: () => void;
  setLibData: (data: any[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, searchQuery, setSearchQuery, 
  expandedMenus, toggleMenu, isSaving,
  volumes, soulsData, passivesData, tagsData,
  loadFileContent, createNewEntity, handleGlobalSave, setLibData
}) => {

  // 内部过滤逻辑：确保侧边栏的搜索功能正常工作
  const filteredSouls = soulsData.filter(item => 
    item.name?.includes(searchQuery) || item.id?.includes(searchQuery)
  );
  const filteredTags = tagsData.filter(item => 
    item.name?.includes(searchQuery) || item.id?.includes(searchQuery)
  );

  return (
    <div className="w-80 bg-[#1e1f20] flex flex-col border-r border-zinc-800 shadow-2xl shrink-0">
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/50 h-16">
        <span className="text-xs font-black tracking-widest text-zinc-500 uppercase italic">SoulOS Master</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide">
        {/* --- 1. 小说卷目 --- */}
        <div>
          <button onClick={() => toggleMenu('novel')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-lg text-zinc-400 group">
            <div className="flex items-center gap-3 font-bold text-xs tracking-widest uppercase"><Book size={14}/> 卷目索引</div>
            <ChevronDown size={14} className={expandedMenus.includes('novel') ? "" : "-rotate-90"} />
          </button>
          {expandedMenus.includes('novel') && volumes.map(vol => (
            <div key={vol.id} className="ml-4 mt-2">
              <div className="px-3 py-1 text-[10px] text-zinc-600 font-black uppercase flex justify-between group">
                {vol.id} <Plus size={12} className="hidden group-hover:block cursor-pointer hover:text-white" />
              </div>
              {vol.chapters.map((ch: any) => (
                <button key={ch} onClick={() => { setActiveTab({type:'novel', id: ch, path: `${vol.id}/${ch}`}); loadFileContent(`${vol.id}/${ch}`); }} 
                  className={`w-full text-left px-4 py-1.5 rounded-md truncate ${activeTab.id === ch && activeTab.type === 'novel' ? "text-blue-400 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {ch.replace('.md', '')}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* --- 2. 武魂数据 --- */}
        <div>
          <button onClick={() => toggleMenu('soul')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
            <div className="flex items-center gap-3 font-bold text-xs tracking-widest uppercase"><Shield size={14} className="text-blue-500" /> 武魂库</div>
            <ChevronDown size={14} className={expandedMenus.includes('soul') ? "" : "-rotate-90"} />
          </button>
          {expandedMenus.includes('soul') && (
            <div className="ml-4 mt-2 space-y-1 px-2">
              <div className="relative mb-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={10} className="absolute left-2 top-2.5 text-zinc-600" />
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded py-1.5 pl-6 text-[10px] outline-none" placeholder="搜索武魂..." onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <Plus size={14} className="text-zinc-600 hover:text-white cursor-pointer" onClick={() => createNewEntity('soul')} />
              </div>
              {filteredSouls.map(item => (
                <button key={item.id} onClick={() => { setActiveTab({type: 'soul', id: item.id, path: ''}); setLibData(soulsData); }} 
                  className={`w-full text-left px-4 py-1.5 text-xs rounded-md truncate ${activeTab.id === item.id && activeTab.type === 'soul' ? "text-white bg-zinc-800" : "text-zinc-500 hover:text-zinc-400"}`}>
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 3. 被动特性 --- */}
        <div>
          <button onClick={() => toggleMenu('passive')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
            <div className="flex items-center gap-3 font-bold text-xs tracking-widest uppercase"><Zap size={14} className="text-yellow-500" /> 被动特性库</div>
            <ChevronDown size={14} className={expandedMenus.includes('passive') ? "" : "-rotate-90"} />
          </button>
          {expandedMenus.includes('passive') && (
            <div className="ml-4 mt-2 space-y-4 px-2">
              {['buff', 'resistance', 'speed', 'sense', 'special'].map(type => (
                <div key={type} className="space-y-1">
                  <div className="px-2 text-[9px] text-zinc-700 font-black uppercase tracking-widest border-l border-zinc-800 ml-1">{type}</div>
                  {passivesData.filter(p => p.type === type).map(item => (
                    <button key={item.id} onClick={() => { setActiveTab({type: 'passive', id: item.id, path: ''}); setLibData(passivesData); }} 
                      className={`w-full text-left px-4 py-1 text-[11px] rounded truncate ${activeTab.id === item.id && activeTab.type === 'passive' ? "text-white bg-zinc-800" : "text-zinc-500 hover:text-zinc-400"}`}>
                      {item.name}
                    </button>
                  ))}
                </div>
              ))}
              <button onClick={() => createNewEntity('passive')} className="w-full py-2 border border-dashed border-zinc-800 rounded text-[10px] text-zinc-600 hover:text-zinc-400">+ 新增被动</button>
            </div>
          )}
        </div>

        {/* --- 4. 逻辑标签 --- */}
        <div>
          <button onClick={() => toggleMenu('tag')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
            <div className="flex items-center gap-3 font-bold text-xs tracking-widest uppercase"><Hash size={14} className="text-emerald-500" /> 逻辑标签库</div>
            <ChevronDown size={14} className={expandedMenus.includes('tag') ? "" : "-rotate-90"} />
          </button>
          {expandedMenus.includes('tag') && (
            <div className="ml-4 mt-2 space-y-4 px-2">
              {['substance', 'energy', 'behavior', 'beast', 'apparatus', 'anatomy', 'special'].map(cat => (
                <div key={cat} className="space-y-1">
                  <div className="px-2 text-[9px] text-zinc-700 font-black uppercase tracking-widest border-l border-zinc-800 ml-1">{cat}</div>
                  {filteredTags.filter(t => t.category === cat).map(item => (
                    <button key={item.id} onClick={() => { setActiveTab({type: 'tag', id: item.id, path: ''}); setLibData(tagsData); }} 
                      className={`w-full text-left px-4 py-1 text-[11px] rounded ${activeTab.id === item.id && activeTab.type === 'tag' ? "text-white bg-zinc-800" : "text-zinc-500 hover:text-zinc-400"}`}>
                      {item.name}
                    </button>
                  ))}
                </div>
              ))}
              <button onClick={() => createNewEntity('tag')} className="w-full py-2 border border-dashed border-zinc-800 rounded text-[10px] text-zinc-600 hover:text-zinc-400">+ 新增标签</button>
            </div>
          )}
        </div>
      </div>

      {/* --- 同步按钮 --- */}
      <div className="p-4 border-t border-zinc-800">
        <button onClick={handleGlobalSave} disabled={isSaving} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex flex-col items-center gap-1 transition-all text-white">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isSaving ? "同步位面文件" : "同步位面文件"}</span>
        </button>
      </div>
    </div>
  );
};