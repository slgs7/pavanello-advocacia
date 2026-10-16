import Image from 'next/image';
import { isDevelopment, siteConfig } from '@/site.config';
export function ImageSlot({
  portrait = false,
  label = 'Foto do escritório',
}: {
  portrait?: boolean;
  label?: string;
}) {
  return (
    <div
      className={portrait ? 'portrait-slot' : 'image-slot'}
      aria-label={label}
    >
      {portrait ? (
        <div className="identity-lockup">
          <Image
            src="/logo.png"
            alt=""
            className="monogram"
            width={331}
            height={264}
            priority
          />
          <div className="slot-caption">
            <strong>{siteConfig.name}</strong>
            <span>
              {siteConfig.city} · {siteConfig.state}
            </span>
          </div>
        </div>
      ) : (
        <>
          <Image src="/logo.png" alt="" width={331} height={264} />
          {isDevelopment && <span>[PENDENTE: {label.toLowerCase()}]</span>}
        </>
      )}
    </div>
  );
}
