// src/components/features/novel/NovelEditor.tsx
import React from 'react';
import { BookOpen, Scroll, Type, Loader2 } from "lucide-react";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { Label } from "../../ui/Label";

interface NovelEditorProps {
  title: string;
  setTitle: (val: string) => void;
  outline: string;
  setOutline: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  isReading: boolean;
}

export const NovelEditor: React.FC<NovelEditorProps> = ({
  title, setTitle, outline, setOutline, content, setContent, isReading
}) => {
  if (isReading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
        <Loader2 className="animate-spin" size={32} />
        <span className="text-xs font-black uppercase tracking-[0.4em]">正在调取位面时空记录...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* 章节头部 */}
      <div className="flex items-center gap-6 border-b border-zinc-800/50 pb-8">
        <div className="bg-indigo-600/10 p-4 rounded-2xl">
          <BookOpen className="text-indigo-500" size={24} />
        </div>
        <div className="flex-1">
          <Label className="text-indigo-400">Chapter Title / 章节标题</Label>
          <input 
            className="text-4xl font-black bg-transparent border-none outline-none text-white placeholder:text-zinc-800 w-full mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入章节名称..."
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* 左侧：章节大纲 (占据 4 列) */}
        <div className="col-span-4 flex flex-col">
          <Textarea 
            label="Chapter Outline / 章节大纲"
            className="flex-1 min-h-[500px] bg-zinc-900/10 border-dashed border-zinc-800"
            placeholder="在这里勾勒本章的逻辑线索、武魂碰撞点..."
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
          />
        </div>

        {/* 右侧：正文创作 (占据 8 列) */}
        <div className="col-span-8 flex flex-col relative">
          <div className="absolute top-4 right-6 flex items-center gap-2 text-[10px] text-zinc-600 font-mono z-10">
            <Scroll size={12} />
            WORDS: {content.length}
          </div>
          <Textarea 
            label="Main Content / 章节正文"
            className="flex-1 min-h-[500px] text-lg leading-relaxed font-serif text-zinc-300 bg-transparent border-none p-0 focus:border-none"
            placeholder="开始编织你的位面故事..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};