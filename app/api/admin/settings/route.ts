import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';

export async function PUT(request: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const body = (await request.json()) as {
      whatsapp?: string;
      instagram?: string;
      address?: string;
      hours?: string;
      checkoutMessage?: string;
    };
    const whatsapp = String(body.whatsapp || '').replace(/\D/g, '');
    await getRawDb()
      .prepare(
        'INSERT INTO store_settings (id, whatsapp, instagram, address, hours, checkout_message, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET whatsapp = excluded.whatsapp, instagram = excluded.instagram, address = excluded.address, hours = excluded.hours, checkout_message = excluded.checkout_message, updated_at = excluded.updated_at',
      )
      .bind(
        'store',
        whatsapp,
        String(body.instagram || '').trim(),
        String(body.address || '').trim(),
        String(body.hours || '').trim(),
        String(body.checkoutMessage || '').trim(),
        Date.now(),
      )
      .run();
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível salvar as configurações.' },
      { status: 500 },
    );
  }
}
