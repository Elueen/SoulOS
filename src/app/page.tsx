"use client";
import { useLibrary } from "@/hooks/useLibrary";
import { Sidebar } from "@/components/layout/Sidebar";
import { EntityHeader } from "@/components/features/library/EntityHeader";
import { NovelEditor } from "@/components/features/novel/NovelEditor";
import { SoulEditor } from "@/components/features/library/SoulEditor";
import { TagEditor } from "@/components/features/library/TagEditor";
import { PassiveEditor } from "@/components/features/library/PassiveEditor";
import { ActorEditor } from "@/components/features/library/ActorEditor";
import { OrganizationEditor } from "@/components/features/library/OrganizationEditor";
import { TechniqueEditor } from "@/components/features/library/TechniqueEditor";
import { ItemEditor } from "@/components/features/library/ItemEditor";
import { SoulBoneEditor } from "@/components/features/library/SoulBoneEditor";

import { AIResonancePanel } from "@/components/layout/AIResonancePanel";

export default function SoulOS_Pro_Studio() {
  const { 
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
  } = useLibrary();

  // 更新类型标签映射，将 technique 明确为模版库
  const getLabelByType = (type: string) => {
    const labels: Record<string, string> = {
      actor: 'World Actor / 人物档案',
      soul: 'Soul Unit / 武魂百科',
      organization: 'Organization / 势力组织',
      technique: 'Skill Template / 技能模版库',
      souls_bone: 'Soul Bone / 魂骨收藏',
      item: 'Inventory Item / 库藏物品',
      passive: 'Passive Trait / 被动特性',
      tag: 'Logic Tag / 逻辑标签'
    };
    return labels[type] || 'Unknown Entity';
  };

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden text-sm">
      
      {/* --- 1. 左侧边栏 (管理 8 大核心档案库) --- */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        isSaving={isSaving}
        volumes={volumes}
        actorsData={filteredActors}
        soulsData={soulsData}
        passivesData={passivesData}
        tagsData={tagsData}
        orgsData={orgsData}
        techsData={techsData} // 注入技能模版库数据
        itemsData={itemsData}
        bonesData={bonesData}
        loadFileContent={loadFileContent}
        createNewEntity={createNewEntity}
        handleGlobalSave={handleGlobalSave}
        setLibData={setLibData}
      />

      {/* --- 2. 主编辑区 --- */}
      <main className="flex-1 flex flex-col bg-[#131314] overflow-hidden">
        {activeTab.type === 'novel' ? (
          <div className="p-16 h-full overflow-y-auto scrollbar-hide">
            {activeTab.id ? (
              <NovelEditor 
                title={title}
                setTitle={setTitle}
                outline={outline}
                setOutline={setOutline}
                content={content}
                setContent={setContent}
                isReading={isReading}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-800 font-black text-4xl uppercase tracking-[1em] opacity-20 select-none">
                Select A Chapter
              </div>
            )}
          </div>
        ) : (
          <div className="p-16 overflow-y-auto h-full max-w-5xl mx-auto w-full scrollbar-hide">
            {currentEntity ? (
              <div className="space-y-8">
                {/* 统一的实体头部 */}
                <EntityHeader 
                  data={currentEntity}
                  onUpdate={updateCurrentEntity}
                  onDelete={deleteEntity}
                  typeLabel={getLabelByType(activeTab.type)}
                />
                
                {/* 动态分发编辑器组件 */}
                <div className="mt-8">
                  {activeTab.type === 'actor' && (
                    <ActorEditor 
                      data={currentEntity as any} 
                      onUpdate={updateCurrentEntity} 
                      soulsData={soulsData} 
                      passivesData={passivesData} 
                      itemsData={itemsData} 
                      bonesData={bonesData}
                      techsData={techsData} // 关键注入：用于 Actions 选项卡的选择器
                    />
                  )}
                  {activeTab.type === 'soul' && (
                    <SoulEditor data={currentEntity} passivesData={passivesData} tagsData={tagsData} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'organization' && (
                    <OrganizationEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'technique' && (
                    <TechniqueEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'item' && (
                    <ItemEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'souls_bone' && (
                    <SoulBoneEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'tag' && (
                    <TagEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                  {activeTab.type === 'passive' && (
                    <PassiveEditor data={currentEntity} onUpdate={updateCurrentEntity} />
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-800 font-black text-4xl uppercase tracking-[1em] opacity-20 select-none">
                No Entity Selected
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- 3. 右侧 AI 助手面板 --- */}
      <AIResonancePanel activeTabType={activeTab.type} />
    </div>
  );
}