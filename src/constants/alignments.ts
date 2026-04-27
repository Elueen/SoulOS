export interface AlignmentDefinition {
  id: string;
  name: string;
  description: string;
}

export const ALIGNMENT_LIST: AlignmentDefinition[] = [
  { id: "Lawful Good", name: "守序善良", description: "信奉秩序与正义，以法律和道义为准则。" },
  { id: "Neutral Good", name: "中立善良", description: "一心向善，不拘泥于法律规则，视情况而定。" },
  { id: "Chaotic Good", name: "混乱善良", description: "随心而行，为了行善可以无视任何陈规陋习。" },
  { id: "Lawful Neutral", name: "守序中立", description: "坚持法律、传统或纪律，不考虑其背后的道德价值。" },
  { id: "True Neutral", name: "绝对中立", description: "追求平衡，不偏袒任何一方，顺应自然。" },
  { id: "Chaotic Neutral", name: "混乱中立", description: "极度追求个人自由，不爱受约束，行为难以捉摸。" },
  { id: "Lawful Evil", name: "守序邪恶", description: "在秩序的框架内谋取私利，有原则地作恶。" },
  { id: "Neutral Evil", name: "中立邪恶", description: "纯粹的利己主义者，为了利益可以出卖任何人。" },
  { id: "Chaotic Evil", name: "混乱邪恶", description: "不仅邪恶而且反复无常，以此为乐或宣泄暴力。" }
];