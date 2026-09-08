import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';

const allowed = new Set([
  'Novo',
  'Em atendimento',
  'Confirmado',
  'Preparando',
  'Finalizado',
  'Cancelado',
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const [body, { id }] = await Promise.all([
      request.json() as Promise<{ status?: string }>,
      params,
    ]);
    if (!body.status || !allowed.has(body.status))
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    await getRawDb()
      .prepare('UPDATE orders SET status = ? WHERE id = ?')
      .bind(body.status, id)
      .run();
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível atualizar o pedido.' },
      { status: 500 },
    );
  }
}
