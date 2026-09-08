import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const body = (await request.json()) as {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      active?: boolean;
    };
    if (!body.name?.trim() || !body.slug?.trim())
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios.' },
        { status: 400 },
      );
    const id = body.id || crypto.randomUUID();
    await getRawDb()
      .prepare(
        'INSERT INTO categories (id, name, slug, description, active, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, description = excluded.description, active = excluded.active',
      )
      .bind(
        id,
        body.name.trim(),
        body.slug.trim(),
        body.description?.trim() || '',
        Number(body.active !== false),
        Date.now(),
      )
      .run();
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível salvar a categoria.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id)
      return NextResponse.json(
        { error: 'Categoria inválida.' },
        { status: 400 },
      );
    await getRawDb().batch([
      getRawDb()
        .prepare('UPDATE products SET category_id = NULL WHERE category_id = ?')
        .bind(id),
      getRawDb().prepare('DELETE FROM categories WHERE id = ?').bind(id),
    ]);
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível excluir a categoria.' },
      { status: 500 },
    );
  }
}
