import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json(); 
    // filePath 格式为 "vol_00/chapter_00.md"
    const [vol, file] = filePath.split('/');
    const fullPath = path.join(process.cwd(), 'src', 'data', 'volumes', vol, 'chapters', file);
    
    const content = await fs.readFile(fullPath, 'utf-8');
    let outline = "", body = content;
    
    if (content.includes('---OUTLINE---')) {
      const parts = content.split('---OUTLINE---');
      outline = parts[0].trim();
      body = parts[1].trim();
    }
    return NextResponse.json({ outline, body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}