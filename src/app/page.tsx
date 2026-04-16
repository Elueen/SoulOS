"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  Book, User, Shield, Zap, Plus, FileText, 
  ChevronDown, ChevronRight, Loader2, Save, 
  Sparkles, PenTool, Layout, Trash2, Search, Hash, Sword
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { SoulEditor } from "@/components/features/library/SoulEditor";
import { TagEditor } from "@/components/features/library/TagEditor";
import { PassiveEditor } from "@/components/features/library/PassiveEditor";
import { AIResonancePanel } from "@/components/layout/AIResonancePanel";

export default function SoulOS_Pro_Studio() {
  // --- 状态管理 ---
  const [activeTab, setActiveTab] = useState({ type: 'novel', id: '', path: '' });
  const [title, setTitle] = useState("");
  const [volumes, setVolumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 内容状态
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  
  // --- 关键：拆分数据源，防止侧边栏冲突 ---
  const [soulsData, setSoulsData] = useState<any[]>([]); 
  const [passivesData, setPassivesData] = useState<any[]>([]);
  const [tagsData, setTagsData] = useState<any[]>([]);   
  const [libData, setLibData] = useState<any[]>([]);    

  // UI 交互
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['novel']); 
  const [isSaving, setIsSaving] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // --- 初始化加载 ---
  const refreshVolumes = async () => {
    const res = await fetch("/api/files/scan");
    const data = await res.json();
    if (Array.isArray(data)) setVolumes(data);
    setLoading(false);
  };

  useEffect(() => { 
    refreshVolumes(); 
    loadLibData('tag');
    loadLibData('soul');
    loadLibData('passive');
  }, []);

  const loadLibData = async (type: string) => {
    const res = await fetch(`/api/data?type=${type}`);
    const data = await res.json();
    const safeData = Array.isArray(data) ? data : [];
    
    if (type === 'soul') setSoulsData(safeData);
    if (type === 'tag') setTagsData(safeData);
    if (type === 'passive') setPassivesData(safeData); 
    
    setLibData(safeData);
  };

  const loadFileContent = async (filePath: string) => {
    setIsReading(true);
    const res = await fetch("/api/files/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath }),
    });
    const data = await res.json();
    setOutline(data.outline || "");
    setContent(data.body || "");
    setTitle(filePath.split('/').pop()?.replace('.md', '') || "");
    setIsReading(false);
  };

  // --- 统一的新建实体逻辑 (修复报错并整合旧功能) ---
  const createNewEntity = async (type: 'soul' | 'tag' | 'passive') => {
    const typeNames = { soul: '武魂', tag: '标签', passive: '被动特性' };
    const name = prompt(`请输入新${typeNames[type]}名称:`);
    if (!name) return;

    const newId = (type === 'soul' ? 'S' : type === 'tag' ? 'tag_' : 'psv_') + Date.now();
    let newItem: any = { id: newId, name, description: "" };

    if (type === 'soul') {
      newItem = { 
        ...newItem, 
        category: "Apparatus", 
        tags: [], 
        passives: [],
        true_form: { name: "", description: "", boost_effect: "" }, 
        actions: [] 
      };
    } else if (type === 'tag') {
      newItem = { ...newItem, category: "behavior" };
    } else if (type === 'passive') {
      newItem = { ...newItem, type: "buff", value: "0" };
    }

    const currentSource = type === 'soul' ? soulsData : type === 'tag' ? tagsData : passivesData;
    const updated = [...currentSource, newItem];

    if (type === 'soul') setSoulsData(updated);
    else if (type === 'tag') setTagsData(updated);
    else if (type === 'passive') setPassivesData(updated);

    setLibData(updated);
    setActiveTab({ type, id: newId, path: '' });

    await fetch(`/api/data?type=${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data: updated }),
    });
  };

  // --- 统一保存 ---
  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      const url = activeTab.type === 'novel' ? "/api/files/write" : "/api/data";
      const body = activeTab.type === 'novel' 
        ? { filePath: activeTab.path, outline, body: content, newTitle: title }
        : { type: activeTab.type, data: libData };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await refreshVolumes(); 
        if (activeTab.type !== 'novel') await loadLibData(activeTab.type);
      }
    } catch (err) {
      console.error("同步持久化失败:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntity = (id: string) => {
    if(confirm("确定要永久抹除该实体的记录吗？")) {
      const updated = libData.filter(i => i.id !== id);
      setLibData(updated);
      if (activeTab.type === 'soul') setSoulsData(updated);
      if (activeTab.type === 'tag') setTagsData(updated);
      if (activeTab.type === 'passive') setPassivesData(updated);
      setActiveTab({ type: activeTab.type, id: '', path: '' });
      handleGlobalSave();
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]);
    if (['soul', 'char', 'passive', 'tag'].includes(menu)) loadLibData(menu);
  };

  const filteredSouls = useMemo(() => {
    return soulsData.filter(item => item.name?.includes(searchQuery) || item.id?.includes(searchQuery));
  }, [soulsData, searchQuery]);

  const filteredTags = useMemo(() => {
    return tagsData.filter(item => item.name?.includes(searchQuery) || item.id?.includes(searchQuery));
  }, [tagsData, searchQuery]);

  const currentEntity = libData.find(item => item.id === activeTab.id);

  // 辅助函数：实时更新当前编辑的实体数据
  const updateCurrentEntity = (newData: any) => {
    const updated = libData.map(item => item.id === activeTab.id ? newData : item);
    setLibData(updated);
    if (activeTab.type === 'soul') setSoulsData(updated);
    if (activeTab.type === 'passive') setPassivesData(updated);
    if (activeTab.type === 'tag') setTagsData(updated);
  };

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden text-sm">
      
      {/* --- 1. 左侧边栏 --- */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        isSaving={isSaving}
        volumes={volumes}
        soulsData={soulsData}
        passivesData={passivesData}
        tagsData={tagsData}
        loadFileContent={loadFileContent}
        createNewEntity={createNewEntity}
        handleGlobalSave={handleGlobalSave}
        setLibData={setLibData}
      />

      {/* --- 2. 主编辑区 --- */}
      <div className="flex-1 flex flex-col bg-[#131314] overflow-hidden">
        {activeTab.type === 'novel' ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="h-40 border-b border-zinc-800/50 bg-[#1e1f20]/10 p-6 flex flex-col">
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Layout size={12}/> 大纲控制台</div>
              <textarea className="flex-1 bg-transparent w-full text-sm text-zinc-500 italic outline-none resize-none" value={outline} onChange={e => setOutline(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto px-20 py-16 scrollbar-hide">
              <div className="max-w-3xl mx-auto">
                <input className="bg-transparent text-5xl font-black outline-none mb-12 w-full text-white" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="bg-transparent w-full min-h-[800px] outline-none resize-none text-xl leading-[2.2] text-zinc-300 font-serif" value={content} onChange={e => setContent(e.target.value)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 overflow-y-auto h-full scrollbar-hide max-w-5xl mx-auto w-full">
            {currentEntity ? (
              <div className="space-y-12 pb-32">
                <header className="flex justify-between items-end border-b border-zinc-800 pb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Identifier</span>
                      <input 
                        className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 font-mono text-[10px] outline-none border border-zinc-800" 
                        value={currentEntity.id} 
                        onChange={e => {
                          const newId = e.target.value;
                          const updated = libData.map(i => i.id === activeTab.id ? { ...i, id: newId } : i);
                          setLibData(updated);
                          if (activeTab.type === 'soul') setSoulsData(updated);
                          if (activeTab.type === 'tag') setTagsData(updated);
                          if (activeTab.type === 'passive') setPassivesData(updated);
                          setActiveTab(prev => ({ ...prev, id: newId }));
                        }} 
                      />
                    </div>
                    <input className="bg-transparent text-6xl font-black block outline-none focus:text-blue-500 w-full" 
                      value={currentEntity.name} 
                      onChange={e => updateCurrentEntity({...currentEntity, name: e.target.value})} 
                    />
                  </div>
                  <button onClick={() => deleteEntity(currentEntity.id)} className="p-4 text-zinc-700 hover:text-red-500 transition-colors rounded-full"><Trash2 size={28} /></button>
                </header>

                {/* --- 编辑器分发 --- */}
                {activeTab.type === 'soul' ? (
                  <SoulEditor 
                    data={currentEntity} 
                    passivesData={passivesData} 
                    tagsData={tagsData} 
                    onUpdate={updateCurrentEntity} 
                  />
                ) : activeTab.type === 'tag' ? (
                  <TagEditor 
                    data={currentEntity} 
                    onUpdate={updateCurrentEntity} 
                  />
                ) : activeTab.type === 'passive' ? (
                  <PassiveEditor 
                    data={currentEntity} 
                    onUpdate={updateCurrentEntity} 
                  />
                ) : null}
                
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-800 italic gap-6 select-none">
                <Sparkles size={64} strokeWidth={1} className="opacity-10 animate-pulse" />
                <p className="tracking-widest uppercase text-xs opacity-50">位面实体待选中</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- 3. 右侧 AI Resonance --- */}
      <AIResonancePanel activeTabType={activeTab.type} />
    </div>
  );
}