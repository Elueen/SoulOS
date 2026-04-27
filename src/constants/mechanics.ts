export const TRUE_FORM_BOOST_MAP: Record<string, { label: string; ratio: number }> = {
  "白": { label: "0%",   ratio: 0 },
  "黄": { label: "25%",  ratio: 0.25 },
  "紫": { label: "50%",  ratio: 0.5 },
  "黑": { label: "75%",  ratio: 0.75 },
  "红": { label: "100%", ratio: 1.0 }
};

export const getSoulTitle = (level: number): string => {
  if (level >= 100) return "神";
  if (level >= 90) return "封号斗罗";
  if (level >= 80) return "魂斗罗";
  if (level >= 70) return "魂圣";
  if (level >= 60) return "魂帝";
  if (level >= 50) return "魂王";
  if (level >= 40) return "魂宗";
  if (level >= 30) return "魂尊";
  if (level >= 20) return "大魂师";
  if (level >= 10) return "魂师";
  return "魂士";
};

export interface SenseDefinition {
  id: string;      
  name: string;
  unit: string; 
  icon?: string; 
}

export const SENSES_LIST: SenseDefinition[] = [
  { id: "SENSE_blindsight", name: "盲视", unit: "米" },
  { id: "SENSE_darkvision", name: "黑暗视觉", unit: "米" },
  { id: "SENSE_tremorsense", name: "震颤感知", unit: "米" },
  { id: "SENSE_truesight", name: "真实视觉", unit: "米" },
];

export const SOUL_RING_STANDARDS = [
  { label: '白色', value: 'white', min: 1, max: 99 },
  { label: '黄色', value: 'yellow', min: 100, max: 999 },
  { label: '紫色', value: 'purple', min: 1000, max: 9999 },
  { label: '黑色', value: 'black', min: 10000, max: 99999 },
  { label: '红色', value: 'red', min: 100000, max: 999999 },
  { label: '象牙白', value: 'ivory', min: 1000000, max: Infinity },
];

export const SPECIAL_RING_COLORS = [
  { label: '金色', value: 'gold' },
  { label: '银色', value: 'silver' },
  { label: '光耀金', value: 'radiantgold' },
  { label: '绿色', value: 'green' },
  { label: '灰色', value: 'grey' },
  { label: '橙色', value: 'orange' },
  { label: '粉色', value: 'pink' },
  { label: '蓝色', value: 'blue' },
  { label: '暗红', value: 'darkred' },
  { label: '玫金', value: 'rosegold' },
  { label: '血红', value: 'bloodred' },
  { label: '天蓝', value: 'ceruleanblue' },
  { label: '苔藓绿', value: 'mossgreen' },
  { label: '亮粉', value: 'hotpink' },
];

export const getAutoColorByYear = (year: number): string => {
  const found = SOUL_RING_STANDARDS.find(c => year >= c.min && year <= c.max);
  return found ? found.value : 'white';
};