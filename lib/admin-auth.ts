import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function isAdminRequest() {
  return Boolean(await getChatGPTUser());
}
