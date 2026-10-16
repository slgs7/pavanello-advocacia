import Link from 'next/link';
import { siteConfig, isDevelopment } from '@/site.config';
import { Brand } from './brand';
import { Consent } from './consent';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              Escuta atenta. Orientação clara.
              <br />
              Seu caso com o advogado da área.
            </p>
          </div>
          <div className="footer-links">
            <strong>Conheça o escritório</strong>
            <Link href="/sobre">Quem somos</Link>
            <Link href="/areas-de-atuacao">Áreas de atuação</Link>
            <Link href="/noticias">Notícias</Link>
          </div>
          <div className="footer-links">
            <strong>Vamos conversar</strong>
            <a href={`tel:+${siteConfig.phoneDigits}`}>{siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <Link href="/contato">
              {siteConfig.city}, {siteConfig.state}
            </Link>
          </div>
        </div>
        <div className="footer-legal">
          <p>{siteConfig.address}</p>
          <p>{siteConfig.disclaimer}</p>
          {siteConfig.oab ? (
            <p>{siteConfig.oab}</p>
          ) : (
            isDevelopment && (
              <p className="pending">
                [PENDENTE: responsável e inscrição na OAB]
              </p>
            )
          )}
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Consent />
          </div>
        </div>
      </div>
    </footer>
  );
}
