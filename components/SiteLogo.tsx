export function SiteLogo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/api/site-asset/logo" alt="Logo" className={className} />;
}
