import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // 指向 src/data/volumes
    const volumesBaseDir = path.join(process.cwd(), 'src', 'data', 'volumes');
    const volFolders = await fs.readdir(volumesBaseDir);
    
    const structure = await Promise.all(volFolders.map(async (vol) => {
      if (vol.startsWith('.')) return null; // 过滤隐藏文件
      
      // 关键：深入到 chapters 文件夹
      const chaptersPath = path.join(volumesBaseDir, vol, 'chapters');
      try {
        const stats = await fs.stat(chaptersPath);
        if (stats.isDirectory()) {
          const files = await fs.readdir(chaptersPath);
          return {
            id: vol,
            title: vol, 
            chapters: files.filter(f => f.endsWith('.md'))
          };
        }
      } catch (e) { return null; }
      return null;
    }));

    return NextResponse.json(structure.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: '无法读取目录结构' }, { status: 500 });
  }
}