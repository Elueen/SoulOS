import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// 定义基础路径
const BASE_DATA_PATH = path.join(process.cwd(), 'src', 'data');
const ACTOR_PATH = path.join(BASE_DATA_PATH, 'actors');
const LIB_PATH = path.join(BASE_DATA_PATH, 'library');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // 情况 A: 处理角色 (多文件存储)
    if (type === 'actor') {
      try {
        const files = await fs.readdir(ACTOR_PATH);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        const actors = await Promise.all(
          jsonFiles.map(async (file) => {
            const content = await fs.readFile(path.join(ACTOR_PATH, file), 'utf-8');
            return JSON.parse(content);
          })
        );
        return NextResponse.json(actors);
      } catch (e) {
        // 如果文件夹不存在，返回空数组
        return NextResponse.json([]);
      }
    }

    // 情况 B: 处理其他库设定 (单文件存储，如 souls.json)
    const filePath = path.join(LIB_PATH, `${type}s.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body; 

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    // 情况 A: 保存角色 (分布式保存)
    if (type === 'actor') {
      await fs.mkdir(ACTOR_PATH, { recursive: true });

      // 获取当前文件夹内已有的文件，用于同步删除逻辑
      const existingFiles = await fs.readdir(ACTOR_PATH).catch(() => []);

      if (Array.isArray(data)) {
        // 1. 写入/更新当前列表中的每一个角色
        const currentFileNames = data.map(actor => `${actor.id}.json`);
        
        await Promise.all(data.map(async (actor: any) => {
          const actorFilePath = path.join(ACTOR_PATH, `${actor.id}.json`);
          await fs.writeFile(actorFilePath, JSON.stringify(actor, null, 2), 'utf-8');
        }));

        // 2. 清理逻辑：如果在文件夹里但在 data 数组里没了，说明被删除了
        const filesToDelete = existingFiles.filter(f => f.endsWith('.json') && !currentFileNames.includes(f));
        await Promise.all(filesToDelete.map(f => fs.unlink(path.join(ACTOR_PATH, f))));
      }
      
      return NextResponse.json({ message: "Actors synced successfully" });
    }

    // 情况 B: 保存其他库设定 (覆盖单文件)
    const filePath = path.join(LIB_PATH, `${type}s.json`);
    await fs.mkdir(LIB_PATH, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ message: "Library synced successfully" });
  } catch (error: any) {
    console.error("Save Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}