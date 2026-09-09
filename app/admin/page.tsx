import { AdminClient } from '@/components/admin-client';
import { requireAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const email = await requireAdminSession();
  return <AdminClient userName={email} signOutPath="/api/admin/logout" />;
}
