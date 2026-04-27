export interface GenderDefinition {
  id: string;
  name: string;
}

export const GENDER_LIST: GenderDefinition[] = [
  { id: "Male", name: "男性" },
  { id: "Female", name: "女性" },
  { id: "Non-Binary", name: "非二元性别" },
  { id: "Unknown", name: "未知/神秘" }
];