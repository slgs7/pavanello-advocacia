import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { siteConfig, isDevelopment } from '@/site.config';
import { ContactForm } from './contact-form';
export function ContactSection({ initialArea }: { initialArea?: string }) {
  return (
    <section className="section contact" id="contato">
      <div className="container contact-grid">
        <div className="contact-copy">
          <h2>
            O primeiro passo
            <br />é uma conversa.
          </h2>
          <p>
            A primeira conversa serve para entender seu caso e indicar o
            advogado da área. Conte com atenção desde o início.
          </p>
          <div className="contact-details">
            <div className="detail">
              <Phone size={20} />
              <div>
                <small>Telefone e WhatsApp</small>
                <a href={`tel:+${siteConfig.phoneDigits}`}>
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            <div className="detail">
              <MapPin size={20} />
              <div>
                <small>Nosso endereço</small>
                <p>
                  {siteConfig.street}
                  <br />
                  {siteConfig.city}, {siteConfig.state} ·{' '}
                  {siteConfig.postalCode}
                </p>
                {siteConfig.mapsUrl ? (
                  <a
                    className="text-link small"
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir no Google Maps
                  </a>
                ) : (
                  isDevelopment && (
                    <p className="pending">
                      [PENDENTE: link do perfil no Google Maps]
                    </p>
                  )
                )}
              </div>
            </div>
            <div className="detail">
              <Mail size={20} />
              <div>
                <small>E-mail</small>
                <a className="small" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="detail">
              <Clock size={20} />
              <div>
                <small>Atendimento</small>
                <p>{siteConfig.hours || 'Consulte a equipe para agendar.'}</p>
                {!siteConfig.hours && isDevelopment && (
                  <p className="pending">[PENDENTE: horário oficial]</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <ContactForm initialArea={initialArea} />
      </div>
    </section>
  );
}
