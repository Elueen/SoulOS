export interface TraitDefinition {
  id: string;
  name: string;
  conflicts: string[];
  description: string;
}

export const TRAITS_LIST: TraitDefinition[] = [
  { id: "Compassionate", name: "善良", conflicts: ["Callous", "Sadistic"], description: "同情他人的不幸，不愿伤害弱小，内心柔软。" },
  { id: "Callous", name: "冷酷", conflicts: ["Compassionate"], description: "漠视他人的痛苦，行事果断且无情。" },
  { id: "Sadistic", name: "施虐成性", conflicts: ["Compassionate"], description: "从他人的痛苦中获得快感，行为卑劣且暴虐。" },
  { id: "Fickle", name: "善变", conflicts: ["Stubborn", "Patient"], description: "意志不坚定，容易受外界影响或改变主意。" },
  { id: "Stubborn", name: "顽固", conflicts: ["Fickle"], description: "坚持己见，不听劝告，即便错误也难以改变立场。" },
  { id: "Eccentric", name: "古怪", conflicts: [], description: "行为举止异于常人，思维跳跃，常有惊人之举。" },
  { id: "Brave", name: "勇敢", conflicts: ["Craven"], description: "直面危险时无所畏惧，愿意冒险。" },
  { id: "Craven", name: "懦弱", conflicts: ["Brave"], description: "胆小事，在危险面前第一反应是逃避。" },
  { id: "Calm", name: "冷静", conflicts: ["Wrathful", "Impatient"], description: "处变不惊，理智分析局势，情绪稳定。" },
  { id: "Wrathful", name: "易怒", conflicts: ["Calm", "Patient"], description: "情绪火爆，极易被激怒，爆发时具有强烈破坏欲。" },
  { id: "Chaste", name: "贞洁", conflicts: ["Lustful"], description: "洁身自好，严格克制生理欲望和情感冲动。" },
  { id: "Lustful", name: "色欲", conflicts: ["Chaste"], description: "欲望强烈，容易被美色或生理本能所左右。" },
  { id: "Content", name: "知足", conflicts: ["Ambitious"], description: "满足于现状，不争名利，追求内心安宁。" },
  { id: "Ambitious", name: "野心勃勃", conflicts: ["Content"], description: "渴望权力、地位和更强实力，永不满足。" },
  { id: "Diligent", name: "勤勉", conflicts: ["Lazy"], description: "做事刻苦努力，从不懈怠。" },
  { id: "Lazy", name: "懒惰", conflicts: ["Diligent"], description: "贪图享乐，逃避责任或枯燥的修炼。" },
  { id: "Forgiving", name: "宽容", conflicts: ["Vengeful"], description: "容易原谅他人，倾向于化解仇恨。" },
  { id: "Vengeful", name: "有仇必报", conflicts: ["Forgiving"], description: "记仇且必然复仇，认为以牙还牙理所应当。" },
  { id: "Generous", name: "慷慨", conflicts: ["Greedy"], description: "乐于分享财富、资源和知识。" },
  { id: "Greedy", name: "贪婪", conflicts: ["Generous"], description: "极度渴望财富，吝啬分享，利益至上。" },
  { id: "Gregarious", name: "社交达人", conflicts: ["Shy"], description: "喜欢与人相处，擅长社交。" },
  { id: "Shy", name: "腼腆", conflicts: ["Gregarious"], description: "不擅社交，在人群中感到不安。" },
  { id: "Honest", name: "诚实", conflicts: ["Deceitful"], description: "坚持说实话，不屑于欺骗手段。" },
  { id: "Deceitful", name: "狡诈", conflicts: ["Honest", "Just"], description: "擅长谎言与伪装，行事隐秘。" },
  { id: "Humble", name: "谦卑", conflicts: ["Arrogant"], description: "为人低调，不炫耀成就或身份。" },
  { id: "Arrogant", name: "傲慢", conflicts: ["Humble"], description: "自视甚高，看不起实力低于自己的人。" },
  { id: "Just", name: "公正", conflicts: ["Arbitrary", "Deceitful"], description: "坚持公平与法度，不偏不倚。" },
  { id: "Arbitrary", name: "肆意妄为", conflicts: ["Just"], description: "全凭个人喜好，蔑视规则，反复无常。" },
  { id: "Patient", name: "耐心", conflicts: ["Impatient", "Wrathful", "Fickle"], description: "能够长久等待时机，沉得住气。" },
  { id: "Impatient", name: "急躁", conflicts: ["Patient", "Calm"], description: "缺乏耐性，因等待而焦虑。" },
  { id: "Temperate", name: "节制", conflicts: ["Gluttonous"], description: "生活克制，不放纵欲望。" },
  { id: "Gluttonous", name: "贪食", "conflicts": ["Temperate"], "description": "追求物质享受，缺乏自控力。" },
  { id: "Trusting", name: "信任", conflicts: ["Paranoid"], description: "容易相信他人善意，显得天真。" },
  { id: "Paranoid", name: "多疑", conflicts: ["Trusting"], description: "怀疑一切动机，总觉得有人害己。" },
  { id: "Zealous", name: "狂热", conflicts: ["Cynical"], description: "信念极其坚定，排斥异见。" },
  { id: "Cynical", name: "愤世嫉俗", conflicts: ["Zealous", "Trusting"], description: "怀疑人性，用悲观和讥讽看世界。" }
];