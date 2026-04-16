import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'library', `${type}s.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body; // 关键：从请求体中解构出 type 和整个列表数据
    
    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'library', `${type}s.json`);
    
    // 关键：将整个数组数据覆盖写入对应的 JSON 文件
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ message: "Successfully synced to local disk" });
  } catch (error: any) {
    console.error("Save Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}