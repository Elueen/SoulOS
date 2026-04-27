export interface ConditionDefinition {
  id: string;
  name: string;
  summary: string;
}

export const CONDITIONS_LIST: ConditionDefinition[] = [
  { id: "blinded", name: "失明", summary: "你看不见东西，自动在需要视线的检定中失败，攻击检定处于劣势，攻击你的人在你可被感知的前提下对你拥有优势。" },
  { id: "charmed", name: "魅惑", summary: "你无法攻击魅惑者，也无法用有害能力或魔法针对其；魅惑者在与你的社交互动检定中拥有优势。" },
  { id: "chilled", name: "寒战", summary: "你受到极寒的侵袭。你的移动速度减半；你在所有敏捷相关的能力检定、攻击检定与豁免检定中处于劣势。若再次受到寒冷伤害，可能转化为‘冰冻’。" },
  { id: "deafened", name: "耳聋", summary: "你听不见东西，自动在需要听觉的检定中失败。" },
  { id: "exhaustion", name: "力竭", summary: "力竭有 6 级；每一级都会造成累计惩罚（如检定/攻击劣势、速度降低等），达到第 6 级时死亡。" },
  { id: "frightened", name: "恐惧", summary: "当你能看见恐惧源且其在 30 尺范围内时，你的能力检定与攻击检定处于劣势；你无法自愿靠近恐惧源。" },
  { id: "frozen", name: "冰冻", summary: "你被封印在冰中。你处于失能状态，速度变为 0；你自动在力量与敏捷豁免中失败；攻击你的人具有优势；获得火属性以外伤害抗性，受火伤立即解除。" },
  { id: "grappled", name: "擒抱", summary: "你的速度变为 0；擒抱结束时恢复移动；擒抱者失能或你离开其触及范围时结束。" },
  { id: "incapacitated", name: "失能", summary: "你无法采取动作、附赠动作或反应。" },
  { id: "invisible", name: "隐形", summary: "你无法被看见；对你进行的攻击检定处于劣势；你的攻击检定具有优势；仍可被其他感官察觉。" },
  { id: "paralyzed", name: "麻痹", summary: "你失能且无法移动或说话；自动在力量与敏捷豁免中失败；攻击你的人有优势；5 尺内命中必重击。" },
  { id: "petrified", name: "石化", summary: "你变为固体；失能、无法移动或说话，且无感知；自动在力量与敏捷豁免中失败；攻击你的人有优势；免疫毒素与疾病。" },
  { id: "poisoned", name: "中毒", summary: "你的攻击检定与能力检定处于劣势。" },
  { id: "prone", name: "倒地", summary: "移动只能爬行，除非起身；你的攻击检定处于劣势；攻击你的人在 5 尺内有优势，超过则处于劣势。" },
  { id: "restrained", name: "束缚", summary: "你的速度变为 0；你的攻击检定处于劣势；攻击你的人对你有优势；你在敏捷豁免中处于劣势。" },
  { id: "stunned", name: "昏迷", summary: "你失能且无法移动；只能含糊说话；自动在力量与敏捷豁免中失败；攻击你的人对你有优势。" },
  { id: "wet", name: "潮湿", summary: "获得火伤抗性；但对闪电与寒冷伤害获得易伤（伤害翻倍）。若受到寒冷伤害，自动获得‘寒战’或直接被‘冰冻’。" },
  { id: "unconscious", name: "无意识", summary: "失去意识，掉落物品并倒地，攻击你的人对你有优势，且近距离命中必重击。" }
];