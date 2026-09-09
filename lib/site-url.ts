const hostedUrl =
  'https://vitale-produtos-naturais-ibaiti.drchumbadaebalanciam.chatgpt.site';

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || hostedUrl).replace(/\/$/, '');
}
