export interface RaceDefinition {
  id: string;
  name: string;
  description: string;
}

export const RACE_LIST: RaceDefinition[] = [
  { id: "Human", name: "人类", description: "位面最主要的种族，通过觉醒武魂并猎杀魂兽获取魂环进行修炼。" },
  { id: "Beast", name: "魂兽", description: "拥有魂力的兽类，寿命极长，通过年限积攒实力，死后产生魂环与魂骨。" },
  { id: "Spirit", name: "魂灵", description: "魂师与魂兽在平等契约下产生的特殊生命形态，保留魂兽意识并转化为魂环。" },
  { id: "BeastHumanoid", name: "魂兽化形", description: "十万年魂兽选择舍弃兽体转而修为人身，拥有人类的成长速度，但在成熟期前会被高阶魂师识破。" },
  { id: "Hybrid", name: "混血", description: "人类与化形魂兽或其他种族的后代，可能无需猎杀魂兽，直接创造魂环。" },
  { id: "Long", name: "真龙", description: "拥有至高龙神血脉的纯血龙族，位面顶端的掠食者，其魂环与魂骨具有极高的属性增幅。" },
  { id: "God", name: "神祇", description: "突破百级限制、继承神位后的至高生命体，受神界规则约束。" },
  { id: "Undead", name: "亡灵", description: "因特殊能量、死灵魔法或执念残留而存在的生命形式。" },
  { id: "Otherworlder", name: "异界来客", description: "来自本位面之外的事物（如恶魔），可能携带完全不同的规则力量。" },
  { id: "Other", name: "其他", description: "无法被归入上述分类的奇特生命或造物。" }
];