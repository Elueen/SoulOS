// src/app/api/files/write/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { filePath, outline, body, newTitle } = await request.json();
    const [vol, file] = filePath.split('/'); // 例如 ["vol_00", "chapter_00.md"]
    
    const baseDir = path.join(process.cwd(), 'src', 'data', 'volumes', vol, 'chapters');
    const oldFullPath = path.join(baseDir, file);
    
    // 1. 处理重命名逻辑
    let finalPath = oldFullPath;
    let finalFileName = file;

    if (newTitle && newTitle + '.md' !== file) {
      finalFileName = newTitle + '.md';
      const newFullPath = path.join(baseDir, finalFileName);
      await fs.rename(oldFullPath, newFullPath);
      finalPath = newFullPath;
    }

    // 2. 写入内容
    const fileContent = `${outline}\n\n---OUTLINE---\n\n${body}`;
    await fs.writeFile(finalPath, fileContent, 'utf-8');
    
    return NextResponse.json({ 
      message: '保存成功', 
      newPath: `${vol}/${finalFileName}`,
      newId: finalFileName
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}