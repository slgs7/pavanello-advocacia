import Image from 'next/image';
import Link from 'next/link';
import { escritorio } from '@/content/escritorio';
import { isDevelopment } from '@/site.config';
import { ImageSlot } from './image-slot';
export function OfficeSection() {
  if (!escritorio.length && !isDevelopment) return null;
  return (
    <section className="section light office-section">
      <div className="container">
        <div className="section-heading">
          <h2>
            Um espaço para ouvir.
            <br />
            Uma equipe para orientar.
          </h2>
          <Link href="/sobre" className="text-link">
            Conheça o escritório
          </Link>
        </div>
        <div className="gallery">
          {escritorio.length
            ? escritorio.map((photo) => (
                <div className="image-slot" key={photo.src}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 767px) 45vw, 30vw"
                    style={{ objectFit: 'cover', width: '100%', opacity: 1 }}
                  />
                </div>
              ))
            : Array.from({ length: 6 }, (_, i) => <ImageSlot key={i} />)}
        </div>
      </div>
    </section>
  );
}
