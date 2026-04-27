import React from 'react';
import { Item } from "../../../types"; 
import { Select } from "../../ui/Select";
import { Card } from "../../ui/Card";
import { Textarea } from "../../ui/Textarea"; 

export const ItemEditor: React.FC<{ data: Item; onUpdate: (newData: any) => void }> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-10">
      <Card>
        <Select 
          label="物品分类 / Category"
          value={data.category || "Apparel"}
          options={[
            { value: "Apparel", label: "防具/服饰" },
            { value: "Weapon", label: "武器/暗器" },
            { value: "Consumable", label: "丹药/消耗品" },
            { value: "Quest", label: "特殊剧情道具" }
          ]}
          onChange={e => onUpdate({...data, category: e.target.value})}
        />
      </Card>

      <Textarea 
        label="物品效果 / Effect"
        className="h-80"
        value={data.effect || data.description} 
        onChange={e => onUpdate({...data, effect: e.target.value})} 
      />
    </div>
  );
};