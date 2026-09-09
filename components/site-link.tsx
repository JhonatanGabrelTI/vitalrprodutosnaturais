import NextLink from 'next/link';

export function SiteLink(props: React.ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
