import React from 'react';
import { SoulBone } from "../../../types"; 
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Card } from "../../ui/Card";
import { Textarea } from "../../ui/Textarea"; 

export const SoulBoneEditor: React.FC<{ data: SoulBone; onUpdate: (newData: any) => void }> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-10">
      <Card>
        <div className="grid grid-cols-2 gap-8">
          <Select 
            label="魂骨部位 / Position"
            value={data.position || "Head"}
            options={[
              { value: "Head", label: "头部骨" },
              { value: "Torso", label: "躯干骨" },
              { value: "Left Arm", label: "左臂骨" },
              { value: "Right Arm", label: "右臂骨" },
              { value: "Left Leg", label: "左腿骨" },
              { value: "Right Leg", label: "右腿骨" },
              { value: "External", label: "外附魂骨" }
            ]}
            onChange={e => onUpdate({...data, position: e.target.value})}
          />
          <Input 
            label="附带技能 / Added Skill"
            placeholder="魂骨技名称..."
            value={data.added_skill || ""} 
            onChange={e => onUpdate({...data, added_skill: e.target.value})} 
          />
        </div>
      </Card>

      <Textarea 
        label="被动增益 / Passive Bonus"
        className="h-80"
        value={data.passive_bonus || data.description} 
        onChange={e => onUpdate({...data, passive_bonus: e.target.value})} 
      />
    </div>
  );
};