import React from 'react';
import { Organization } from "../../../types"; 
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { Textarea } from "../../ui/Textarea"; 

export const OrganizationEditor: React.FC<{ data: Organization; onUpdate: (newData: any) => void }> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-10">
      <Card>
        <div className="grid grid-cols-2 gap-8">
          <Input 
            label="组织评级 / Rank"
            placeholder="例如: Supreme, Hidden..."
            value={data.rank || ""} 
            onChange={e => onUpdate({...data, rank: e.target.value})} 
          />
          <Input 
            label="总部驻地 / Base"
            placeholder="核心活动区域..."
            value={data.base || ""} 
            onChange={e => onUpdate({...data, base: e.target.value})} 
          />
        </div>
      </Card>

      <Textarea 
        label="组织情报 / Description"
        className="h-80"
        value={data.description} 
        onChange={e => onUpdate({...data, description: e.target.value})} 
      />
    </div>
  );
};