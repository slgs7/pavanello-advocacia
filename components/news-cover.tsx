'use client';
import Image from 'next/image';
import { useState } from 'react';
export function NewsCover({
  url,
  authorized = false,
  alt,
}: {
  url?: string;
  authorized?: boolean;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  if (url && authorized && !failed)
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 767px) 90vw, 40vw"
        unoptimized
        onError={() => setFailed(true)}
        style={{ objectFit: 'cover', opacity: 1, width: '100%' }}
      />
    );
  return <Image src="/logo.png" alt="" width={331} height={264} />;
}
