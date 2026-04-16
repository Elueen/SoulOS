// 定义基础动作接口
export interface Action {
  name: string;
  range: string;
  hit: string;
  damage: string;
  notes?: string;
}

// 定义武魂真身接口
export interface TrueForm {
  name: string;
  description: string;
  boost_effect: string;
}

// 定义武魂实体接口
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

// 定义标签和被动的通用接口
export interface LibraryItem {
  id: string;
  name: string;
  category?: string; // 标签用
  type?: string;     // 被动用
  value?: string;
  description: string;
}