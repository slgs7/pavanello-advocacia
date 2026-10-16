import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${siteConfig.name} — início`}>
      <Image src="/logo.png" alt="" width={48} height={38} priority />
      <span className="brand-name">
        {siteConfig.name.split(' ')[0]}
        <span>{siteConfig.name.split(' ').slice(1).join(' ')}</span>
      </span>
    </Link>
  );
}
