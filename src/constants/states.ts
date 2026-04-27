export interface StatesDefinition {
  id: string;
  name: string;
  description: string;
}

export const STATES_LIST: StatesDefinition[] = [
  { id: "heaven_dou_empire", name: "天斗帝国", description: "松散的分封制。皇权衰微，极度依赖七宝琉璃等大门阀。" },
  { id: "star_luo_empire", name: "星罗帝国", description: "铁血集权。皇室垄断顶级遗产，推行“弑亲继承制”以确保强者上位。" },
  { id: "unknown", name: "未知", description: "不知道哪来的" }
];