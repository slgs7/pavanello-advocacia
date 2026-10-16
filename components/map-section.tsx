import { MapPin } from 'lucide-react';
import { siteConfig } from '@/site.config';
export function MapSection() {
  return (
    <section className="section map-section" id="localizacao">
      <div className="container map-grid">
        <div className="map-copy">
          <MapPin size={28} />
          <h2>
            Estamos perto.
            <br />
            Vamos conversar?
          </h2>
          <p className="muted">
            Um espaço para receber você em {siteConfig.city}.
          </p>
          <address>
            {siteConfig.street}
            <br />
            {siteConfig.city}, {siteConfig.state}
            <br />
            CEP {siteConfig.postalCode}
          </address>
          <a
            href={siteConfig.mapsUrl}
            className="button secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Traçar rota no Google Maps
          </a>
        </div>
        <div className="map-frame">
          <iframe
            src={siteConfig.mapsEmbedUrl}
            title={`Localização de ${siteConfig.name} em ${siteConfig.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-caption"
          >
            <MapPin size={16} />
            {siteConfig.name} · Abrir no mapa
          </a>
        </div>
      </div>
    </section>
  );
}
