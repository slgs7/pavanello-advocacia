'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessagesSquare, Star } from 'lucide-react';
import { useRef } from 'react';
import { siteConfig, isDevelopment } from '@/site.config';
import { retrato } from '@/content/escritorio';
import { ImageSlot } from './image-slot';
import { useHeroMotion } from './use-hero-motion';
import './hero-motion.css';
export function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </span>
  );
}
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroMotion(ref);
  return (
    <section ref={ref} className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-location" data-hero-enter>
            <MapPin size={16} />
            {siteConfig.city}, {siteConfig.state} · Atendimento com proximidade
          </div>
          <h1>Advocacia em {siteConfig.city} que vai direto ao ponto.</h1>
          <p className="lead" data-hero-enter>
            Cada história merece atenção. Conte o que aconteceu e nós conectamos
            você ao advogado da área.
          </p>
          <div className="button-row" data-hero-enter>
            <Link className="button primary" href="#contato">
              <span className="hero-button-label">Fale conosco</span>
            </Link>
            <Link className="button secondary" href="#areas">
              <span className="hero-button-label">Ver áreas de atuação</span>
              <span
                className="hero-button-label hero-button-label-filled"
                aria-hidden="true"
              >
                Ver áreas de atuação
              </span>
            </Link>
          </div>
          {(siteConfig.reviewsApproved || isDevelopment) && (
            <div className="hero-proof" data-hero-enter>
              <span className="rating-number">{siteConfig.rating}</span>
              <div>
                <Stars />
                {siteConfig.mapsUrl ? (
                  <a
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small"
                  >
                    {siteConfig.reviewCount} avaliações no Google
                  </a>
                ) : (
                  <span className="small">
                    {siteConfig.reviewCount} avaliações no Google
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="hero-art">
          <Image
            className="hero-watermark"
            src="/logo.png"
            alt=""
            width={662}
            height={528}
          />
          <div className="hero-card-scroll">
            <div className="hero-card-enter" data-hero-enter>
              {retrato ? (
                <div className="portrait-slot">
                  <Image
                    src={retrato.src}
                    alt={retrato.alt}
                    fill
                    sizes="(max-width: 767px) 90vw, 40vw"
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <ImageSlot
                  portrait
                  label="Espaço reservado para o retrato da coordenadora"
                />
              )}
            </div>
            <div className="portrait-note" data-hero-enter>
              <MessagesSquare size={24} />
              <p>
                Primeiro, a gente escuta.
                <br />
                <strong>Depois, indica o caminho.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
