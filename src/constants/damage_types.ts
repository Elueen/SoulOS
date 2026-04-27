export interface DamageTypeDefinition {
  id: string;
  name: string;
  description: string;
}

export const DAMAGE_TYPES_LIST: DamageTypeDefinition[] = [
  { id: "acid", name: "酸蚀", description: "消化酶或毒性液滴造成的溶解性伤害。" },
  { id: "bludgeoning", name: "钝击", description: "撞击、坠落或绞压造成的物理冲击。" },
  { id: "cold", name: "寒冷", description: "极寒环境造成的冻结与机能迟滞伤害。" },
  { id: "fire", name: "火焰", description: "爆炸或高温魂力灼烧造成的热能伤害。" },
  { id: "force", name: "力场", description: "纯粹的魂力爆发、冲击波或无属性魂力实体化造成的能量伤害。" },
  { id: "lightning", name: "闪电", description: "电流传导及麻痹性电击造成的伤害。" },
  { id: "necrotic", name: "黯蚀", description: "生命吸取类魂技或凋零性能量造成的本源损耗。" },
  { id: "piercing", name: "穿刺", description: "獠牙、箭矢或点对点魂力贯穿造成的伤害。" },
  { id: "poison", name: "毒素", description: "神经毒素、血液毒素或致命毒气造成的持续性机能破坏。" },
  { id: "psychic", name: "精神", description: "精神冲击、幻术干扰或灵魂位阶压制造成的识海伤害。" },
  { id: "radiant", name: "光耀", description: "神圣属性、净化之光或剧烈辐照造成的破邪与灼烧伤害。" },
  { id: "slashing", name: "挥砍", description: "爪击或风刃等切割性攻击造成的裂口伤害。" },
  { id: "thunder", name: "声波", description: "震荡性声波、轰鸣爆震导致的内脏与听觉损伤。" }
];

export const DAMAGE_TYPE_COLORS: Record<string, string> = {
  bludgeoning: "#ADB5BD", 
  piercing: "#ADB5BD",
  slashing: "#ADB5BD",
  acid: "#A2C11C",    
  cold: "#48CAE4",    
  fire: "#E85D04",     
  force: "#D00000",   
  lightning: "#4361EE", 
  necrotic: "#52B788",  
  poison: "#9EF01A", 
  psychic: "#FF006E", 
  radiant: "#FFD60A", 
  thunder: "#9B5DE5", 
};