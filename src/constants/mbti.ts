// src/constants/mbti.ts

export interface MBTIDefinition {
  id: string;
  name: string;
  description: string;
}

export const MBTI_LIST: MBTIDefinition[] = [
  { id: "INTJ", name: "建筑师", description: "富有想象力和战略性的思想家，凡事都有计划。" },
  { id: "INTP", name: "逻辑学家", description: "具有创造力的发明家，对知识有着止步不前的渴望。" },
  { id: "ENTJ", name: "指挥官", description: "大胆、富有想象力且意志强大的领导者，总能找到或开辟出路。" },
  { id: "ENTP", name: "辩论家", description: "聪明好奇的思想者，无法抗拒智力上的挑战。" },
  { id: "INFJ", name: "提倡者", description: "安静而神秘，同时又是鼓舞人心且不知疲倦的理想主义者。" },
  { id: "INFP", name: "调解员", description: "诗意、善良且利他主义的人，总是渴望帮助他人。" },
  { id: "ENFJ", name: "主人公", description: "富有魅力且鼓舞人心的领导者，能够让听众听得入迷。" },
  { id: "ENFP", name: "竞选者", description: "热情、创造力强且爱交际的自由灵魂，总能找到理由微笑。" },
  { id: "ISTJ", name: "物流师", description: "实际且注重事实的人，可靠性不容置疑。" },
  { id: "ISFJ", name: "守卫者", description: "非常专注且温暖的守护者，时刻准备保护其爱戴的人。" },
  { id: "ESTJ", name: "总经理", description: "优秀的管理者，在管理事物或人方面无与伦比。" },
  { id: "ESFJ", name: "执政官", description: "极度奉献、社会化且乐于助人的人，总是渴望提供帮助。" },
  { id: "ISTP", name: "鉴赏家", description: "大胆且实际的实验家，擅长使用各类工具。" },
  { id: "ISFP", name: "探险家", description: "灵活且富有魅力的艺术家，时刻准备探索和体验新鲜事物。" },
  { id: "ESTP", name: "企业家", description: "聪明、精力充沛且感知力极强的人，真心享受生活在边缘感中。" },
  { id: "ESFP", name: "表演者", description: "自发的、精力充沛且热情的表演者——生活在他们周围永不枯燥。" }
];