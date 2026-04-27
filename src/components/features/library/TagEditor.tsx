import React from 'react';
import { LibraryItem } from "../../../types"; 
import { Select } from "../../ui/Select";
import { Label } from "../../ui/Label";
import { Card } from "../../ui/Card";

interface TagEditorProps {
  data: LibraryItem;
  onUpdate: (newData: any) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-10">
      <Card className="max-w-md">
        <Select 
          label="逻辑分类 / Category"
          value={data.category || "behavior"}
          options={[
            { value: "substance", label: "SUBSTANCE (物质)" },
            { value: "energy", label: "ENERGY (能量)" },
            { value: "behavior", label: "BEHAVIOR (行为)" },
            { value: "beast", label: "BEAST (生物)" },
            { value: "apparatus", label: "APPARATUS (构造)" },
            { value: "anatomy", label: "ANATOMY (解剖)" },
            { value: "special", label: "SPECIAL (特殊逻辑)" }
          ]}
          onChange={e => onUpdate({...data, category: e.target.value})}
        />
      </Card>

      <div className="space-y-4 px-2">
        <Label>标签逻辑定义 / Definition</Label>
        <textarea 
          className="w-full h-96 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8 text-zinc-400 text-lg leading-relaxed outline-none focus:border-indigo-900/30 transition-all resize-none" 
          placeholder="定义该标签在位面系统中的底层逻辑..."
          value={data.description} 
          onChange={e => onUpdate({...data, description: e.target.value})} 
        />
      </div>
    </div>
  );
};