import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Actor, Soul, LibraryItem, Organization,
  SkillTemplate, Technique, Item, SoulBone 
} from '@/types'; 

export const useLibrary = () => {
  // --- 基础状态 ---
  const [activeTab, setActiveTab] = useState({ type: 'novel', id: '', path: '' });
  const [title, setTitle] = useState("");
  const [volumes, setVolumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- 小说内容 ---
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  
  // --- 核心设定库数据 ---
  const [soulsData, setSoulsData] = useState<Soul[]>([]); 
  const [passivesData, setPassivesData] = useState<LibraryItem[]>([]);
  const [tagsData, setTagsData] = useState<LibraryItem[]>([]);   
  const [actorsData, setActorsData] = useState<Actor[]>([]);
  const [orgsData, setOrgsData] = useState<Organization[]>([]);
  const [techsData, setTechsData] = useState<SkillTemplate[]>([]);
  const [itemsData, setItemsData] = useState<Item[]>([]);
  const [bonesData, setBonesData] = useState<SoulBone[]>([]);

  // --- 当前操作的库数据容器 (用于编辑器同步) ---
  const [libData, setLibData] = useState<any[]>([]);    

  // --- 辅助 UI 状态 ---
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['novel', 'actor']); 
  const [isSaving, setIsSaving] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // --- 1. 数据解析逻辑：处理 { "key": [] } 格式 ---
  const loadLibData = useCallback(async (type: string) => {
    try {
      const res = await fetch(`/api/data?type=${type}`);
      const data = await res.json();
      
      // 智能提取数组：兼容纯数组或对象包裹格式
      let safeData: any[] = [];
      if (Array.isArray(data)) {
        safeData = data;
      } else if (data && typeof data === 'object') {
        // 尝试寻找匹配的 Key (如 type 为 item，寻找 items 或 item)
        const pluralKey = type.endsWith('y') ? type.slice(0, -1) + 'ies' : type + 's';
        safeData = data[pluralKey] || data[type] || Object.values(data).find(Array.isArray) || [];
      }
      
      // 分发到对应的状态池
      switch (type) {
        case 'soul': setSoulsData(safeData); break;
        case 'tag': setTagsData(safeData); break;
        case 'passive': setPassivesData(safeData); break;
        case 'actor': setActorsData(safeData); break;
        case 'organization': setOrgsData(safeData); break;
        case 'technique': setTechsData(safeData); break;
        case 'item': setItemsData(safeData); break;
        case 'soul_bone': setBonesData(safeData); break;
      }
      
      // 关键：如果当前选中的正是此类型，同步更新 libData 容器
      if (activeTab.type === type) setLibData(safeData);
      
      return safeData;
    } catch (err) {
      console.error(`加载库 ${type} 失败:`, err);
      return [];
    }
  }, [activeTab.type]);

  useEffect(() => { 
    refreshVolumes(); 
    const coreLibs = ['tag', 'soul', 'passive', 'actor', 'organization', 'technique', 'item', 'soul_bone'];
    coreLibs.forEach(lib => loadLibData(lib));
  }, [loadLibData]);

  // --- 2. 核心查询逻辑：多路回退机制 ---
  // 即使 libData 还没来得及更新，也会从原始 Data 池中强制查找
  const currentEntity = useMemo(() => {
    if (!activeTab.id) return null;

    // A计划：从当前的 libData 查找
    let found = libData.find(item => item.id === activeTab.id);
    
    // B计划：如果 libData 还没对齐，去对应的原始池查找
    if (!found) {
      const poolMap: Record<string, any[]> = {
        actor: actorsData,
        soul: soulsData,
        organization: orgsData,
        technique: techsData,
        item: itemsData,
        soul_bone: bonesData,
        passive: passivesData,
        tag: tagsData
      };
      const activePool = poolMap[activeTab.type] || [];
      found = activePool.find((i: any) => i.id === activeTab.id);
    }
    
    return found;
  }, [libData, activeTab.id, activeTab.type, actorsData, soulsData, orgsData, techsData, itemsData, bonesData, passivesData, tagsData]);


  const refreshVolumes = async () => {
    const res = await fetch("/api/files/scan");
    const data = await res.json();
    if (Array.isArray(data)) setVolumes(data);
    setLoading(false);
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

// --- 双步输入 + 语义化 ID ---
  const createNewEntity = async (type: string) => {
    // 第一步：输入中文名
    const name = prompt(`请输入新项目名称 (显示名称):`);
    if (!name) return;

    // 前缀映射
    const prefixMap: Record<string, string> = {
      actor: 'ACT', soul: 'SOL', organization: 'ORG', 
      technique: 'TEC', item: 'ITM', souls_bone: 'BON',
      passive: 'PAS', tag: 'TAG'
    };
    const prefix = prefixMap[type] || 'ID';

    // 第二步：输入语义化 Slug
    const slug = prompt(`请输入系统 ID (前缀 ${prefix}_ 已自动分配):`, "");
    if (!slug) return;

    const finalId = `${prefix}_${slug.toLowerCase().trim()}`;

    // 查重：从所有池子里找
    const allPools = [
      ...actorsData, ...soulsData, ...orgsData, ...techsData, 
      ...itemsData, ...bonesData, ...passivesData, ...tagsData
    ];
    if (allPools.some(item => item.id === finalId)) {
      alert(`错误：ID [${finalId}] 已存在，请换一个。`);
      return;
    }

    // 初始化对象 (照顾强迫症：ID 永远在第一行)
    let newItem: any = { id: finalId, name, description: "" };

    if (type === 'actor') {
      newItem = {
        ...newItem,
        specs: { gender: "Unknown", race: "Human", birthday: { day: 1, month: 1, year: 1148 }, birthplace: "unknown", mbti: "INTJ", alignment: "True Neutral", organization: "", traits: [], souls: [{ soulId: "", soulRings: [] }] },
        abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10, HIT: 10, EVA: 10 },
        traits_passives: [],
        growth: { level: 1, soulSkills: [], techniques: [] },
        memoryStream: [],
        inventory: []
      };
    } else if (type === 'item') {
      newItem = { ...newItem, category: "Apparel", effect: "" };
    } else if (type === 'souls_bone') {
      newItem = { ...newItem, position: "Head", added_skill: "", passive_bonus: "" };
    } else if (type === 'technique') {
      newItem = { ...newItem, type: "", bonus: "", notes: "" };
    } else if (type === 'organization') {
      newItem = { ...newItem, rank: "", base: "" };
    } else if (type === 'technique') {
      newItem = { ...newItem, mechanics: {sp_cost: 0, check: "Attack vs AC", range: 0, Radius: 0, movement: "0", damage: [], conditions: []}, narrative: {visual: ""}};
    } 

    // 获取当前池子和更新函数
    const poolMap: any = { 
      actor: actorsData, soul: soulsData, organization: orgsData, 
      technique: techsData, item: itemsData, souls_bone: bonesData, 
      passive: passivesData, tag: tagsData 
    };
    const setMap: any = {
      actor: setActorsData, soul: setSoulsData, organization: setOrgsData, 
      technique: setTechsData, item: setItemsData, souls_bone: setBonesData, 
      passive: setPassivesData, tag: setTagsData 
    };

    const updated = [...(poolMap[type] || []), newItem];
    
    // 同步本地状态
    setMap[type](updated);
    setLibData(updated);
    setActiveTab({ type, id: finalId, path: '' });

    // 同步到后端
    await fetch(`/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data: updated }),
    });
  };

  // --- 2. 更新实体：支持 ID 变更同步 ---
  const updateCurrentEntity = (newData: any) => {
    const oldId = activeTab.id;
    // 这里的 updated 是针对当前 libData 的更新
    const updated = libData.map(item => item.id === oldId ? newData : item);
    
    setLibData(updated);
    
    // 精确分发更新到各个原始池
    const type = activeTab.type;
    if (type === 'actor') setActorsData(updated);
    else if (type === 'soul') setSoulsData(updated);
    else if (type === 'organization') setOrgsData(updated);
    else if (type === 'technique') setTechsData(updated);
    else if (type === 'item') setItemsData(updated);
    else if (type === 'souls_bone') setBonesData(updated);
    else if (type === 'passive') setPassivesData(updated);
    else if (type === 'tag') setTagsData(updated);

    // 如果 ID 变了，必须更新 activeTab，否则 currentEntity 会变 null 导致编辑器崩溃
    if (newData.id !== oldId) {
      setActiveTab(prev => ({ ...prev, id: newData.id }));
    }
  };

  // --- 3. 删除实体 ---
  const deleteEntity = async (id: string) => {
    if(confirm("确定要永久抹除此项记录吗？")) {
      const updated = libData.filter(i => i.id !== id);
      setLibData(updated);

      // 同步原始池
      const type = activeTab.type;
      const setMap: any = {
        actor: setActorsData, soul: setSoulsData, organization: setOrgsData, 
        technique: setTechsData, item: setItemsData, souls_bone: setBonesData, 
        passive: setPassivesData, tag: setTagsData 
      };
      if (setMap[type]) setMap[type](updated);
      
      await fetch(`/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab.type, data: updated }),
      });
      
      setActiveTab({ type: activeTab.type, id: '', path: '' });
    }
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      const isNovel = activeTab.type === 'novel';
      const url = isNovel ? "/api/files/write" : "/api/data";
      const body = isNovel 
        ? { filePath: activeTab.path, outline, body: content, newTitle: title }
        : { type: activeTab.type, data: libData };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok && !isNovel) await loadLibData(activeTab.type);
      if (res.ok && isNovel) await refreshVolumes();
    } catch (err) {
      console.error("同步持久化失败:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]);
    const dataMenus = ['soul', 'actor', 'passive', 'tag', 'organization', 'technique', 'item', 'soul_bone'];
    if (dataMenus.includes(menu)) loadLibData(menu);
  };

  const filteredActors = useMemo(() => 
    actorsData.filter(item => item.name?.includes(searchQuery) || item.id?.includes(searchQuery)),
    [actorsData, searchQuery]
  );

  return {
    activeTab, setActiveTab, title, setTitle, volumes, loading,
    outline, setOutline, content, setContent,
    soulsData, passivesData, tagsData, actorsData, libData,
    orgsData, techsData, itemsData, bonesData,
    searchQuery, setSearchQuery, expandedMenus, 
    isSaving, isReading,
    currentEntity, filteredActors,
    refreshVolumes, loadLibData, loadFileContent,
    createNewEntity, updateCurrentEntity, deleteEntity,
    handleGlobalSave, toggleMenu, setLibData
  };
};