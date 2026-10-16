'use client';
import type { Avaliacao } from '@/content/avaliacoes';
import { siteConfig } from '@/site.config';
import CardFanCarousel from '@/components/ui/card-fan-carousel';
import { Stars } from './hero';
export function Reviews({ items }: { items: Avaliacao[] }) {
  if (!items.length) return null;
  return (
    <section className="section light reviews-section" id="avaliacoes">
      <div className="container">
        <div className="reviews-heading">
          <div>
            <h2>
              Quem chegou até nós
              <br />
              tem algo a contar.
            </h2>
            <p className="muted">
              Experiências compartilhadas por quem já conhece o escritório.
            </p>
          </div>
          <a
            className="reviews-rating"
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.rating} de 5, ${siteConfig.reviewCount} avaliações no Google Maps`}
          >
            <strong>{siteConfig.rating}</strong>
            <div>
              <Stars />
              <span>{siteConfig.reviewCount} avaliações no Google</span>
            </div>
          </a>
        </div>
      </div>
      <CardFanCarousel
        cards={items.map((item) => ({
          id: item.id,
          author: item.autor,
          text: item.texto,
          rating: item.nota,
          source: item.origem,
          linkUrl: item.url || siteConfig.mapsUrl,
        }))}
      />
    </section>
  );
}
