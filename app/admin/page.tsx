import { AdminClient } from '@/components/admin-client';
import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');
  return (
    <AdminClient
      userName={user.displayName}
      signOutPath={chatGPTSignOutPath('/')}
    />
  );
}
