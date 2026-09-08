import { NextResponse } from 'next/server';
import { readCatalog } from '@/lib/catalog-server';

export async function GET() {
  return NextResponse.json(await readCatalog());
}
