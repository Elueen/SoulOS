import React from 'react';
import { LibraryItem } from "../../../types"; 
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Card } from "../../ui/Card";
import { Textarea } from "../../ui/Textarea"; 

interface PassiveEditorProps {
  data: LibraryItem;
  onUpdate: (newData: any) => void;
}

export const PassiveEditor: React.FC<PassiveEditorProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-10">
      <Card>
        <div className="grid grid-cols-2 gap-8">
          <Select 
            label="特性类型 / Type"
            value={data.type || "resistance"}
            options={[
              { value: "buff", label: "BUFF (属性增强)" },
              { value: "resistance", label: "RESISTANCE (损伤抗性)" },
              { value: "speed", label: "SPEED (移动/身法)" },
              { value: "sense", label: "SENSE (特殊感官)" },
              { value: "special", label: "SPECIAL (特殊逻辑)" }
            ]}
            onChange={e => onUpdate({...data, type: e.target.value})}
          />
          <Input 
            label="数值 / Value"
            placeholder="例如: +10% 或 1d6"
            value={data.value || ""} 
            onChange={e => onUpdate({...data, value: e.target.value})} 
          />
        </div>
      </Card>

      <Textarea 
          label="效果描述 / Effect Description"
          className="h-80"
          value={data.description} 
          onChange={e => onUpdate({...data, description: e.target.value})} 
       />
    </div>
  );
};