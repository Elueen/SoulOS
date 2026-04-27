/**
 * ==========================================
 * 1. 核心定义：武魂、技能与动作
 * ==========================================
 */

// 基础战斗动作
export interface Action {
  name: string;
  range: string;
  hit: string;
  damage: string;
  notes?: string;
}

// 武魂真身
export interface TrueForm {
  name: string;
  description: string;
  boost_effect: string;
}

// 武魂库条目实体
export interface Soul {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  passives: string[];
  true_form: TrueForm;
  actions: Action[];
}

// 魂技项（绑定于魂环）
export interface SoulSkill {
  skillId: string;      //  SkillTemplate
  soulId: string;
  name: string;   
  description: string; 
  year: number;  
  color: string;    
  source: string;       // 来源（魂兽或继承）
  ability: string; 
  order: number;        // 第几魂技
}

// 自创技能/技艺
export interface Technique {
  skillId: string;
  name: string;
  description: string;
  ability: string;   
}

/**
 * ==========================================
 * 2. 角色
 * ==========================================
 */

// 记忆流条目
export interface MemoryEntry {
  id?: string;
  timestamp: number;   // 负数代表背景，正数代表当前剧情
  event: string;       // 事件内容
  impact: string;      // 对性格或身体的影响
  isCore: boolean;     // 是否为核心记忆
  type: 'core' | 'volume' | 'buffer' | 'normal';
}

// 角色实体接口
export interface Actor {
  id: string;
  name: string;
  description: string; // 人物档案介绍
  specs: {
    gender: 'Male' | 'Female' | 'Other' | 'Unknown' | string;
    race: string;
    birthday: {
      day: number;
      month: number;
      year: number;
    };
    birthplace: string;
    mbti: string;
    alignment: string;
    organization: string;
    traits: string[];   
    souls: {            // 支持单/双生武魂
      soulId: string;     // 关联 Soul.id
      soulRings: string[]; 
    }[];
  };
  // 六维属性与派生数值
  abilities: {
    STR: number; DEX: number; CON: number;
    INT: number; WIS: number; CHA: number;
    AC: number;
    MOV: number;

    HP: number;
    HP_REGEN: number;
    SP: number;
    SP_REGEN: number;

    [key: string]: number | undefined;
  };
  traits_passives: string[];
  boon_passives: string[];
  // 成长与技能面板
  growth: {
    level: number;
    soulSkills: SoulSkill[];
    techniques: Technique[]; 
    soul_bones: { id: string; position: string }[];
  };
  memoryStream: MemoryEntry[];
  inventory: { id: string; isEquipped: boolean }[]; // 存放物品 ID (来自 items.json)
  // 实时状态快照
  snapshot?: {
    physicalStatus: string;
    mentalStatus: string;
    currentLocation: string;
    temporaryGoal: string;
  };
}

/**
 * ==========================================
 * 3. 设定库（Library）外部档案接口
 * ==========================================
 */

// 组织机构
export interface Organization {
  id: string;
  name: string;
  description: string;
  rank: string;  // 组织评级
  base: string;  // 总部所在地
}

// 物品道具
export interface Item {
  id: string;
  name: string;
  description: string;
  category: string; // Apparel, Quest, Weapon, etc.
  effect: string;
}

// 魂骨与外部装备
export interface SoulBone {
  id: string;
  name: string;
  description: string;
  position: string;      // 融合部位
  added_skill: string;   // 附带技能
  passive_bonus: string; // 被动增益描述
}

// 原初技能模版
export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  mechanics: {
    sp_cost: number;
    check: string;      //  "Attack vs AC" 或 "DC vs STR Save"
    range: number | string;
    Radius: number | string; //一些aoe
    movement: string;
    damage: { dice: string; type: string }[]; // 支持多重伤害
    conditions: { type: string; dc_mod?: number; }[]; };// 可选：该条件的额外判定难度（比如毒容易中，但麻痹难中
  narrative: {
    visual: string;
  };
}

export interface Modifier {
  target: string;  // "STR", "RES_fire", "AC"
  value: number;   //
}
// 通用库条目（标签、状态等）
export interface LibraryItem {
  id: string;
  name: string;
  category?: string;
  type?: string;
  value?: string;
  description: string;
  summary?: string;
  modifiers?: Modifier[]; 
}


/**
 * ==========================================
 * 4. 常量定义接口 (UI 配置用)
 * ==========================================
 */

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  sub_dimensions: string[];
}

export interface TraitDefinition {
  id: string;
  name: string;
  conflicts: string[];
  description: string;
}

export interface MBTIDefinition {
  id: string;
  name: string;
  description: string;
}

export interface AlignmentDefinition {
  id: string;
  name: string;
  description: string;
}