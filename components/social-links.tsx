'use client';
import { siteConfig, whatsappUrl } from '@/site.config';
import { track } from '@/lib/analytics';
function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m8 7.5 1.5 2-1 1.1c.7 1.8 2.1 3.1 3.9 3.9l1.1-1 2 1.5c.1 1.6-1 2.1-2.4 1.7-3.4-1-5.8-3.4-6.7-6.7-.4-1.4.1-2.5 1.6-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function SocialLinks() {
  return (
    <div className="social-links" aria-label="Redes sociais e contato">
      {siteConfig.instagramUrl ? (
        <a
          className="social-icon"
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram do escritório"
        >
          <InstagramIcon />
        </a>
      ) : (
        <span
          className="social-icon social-pending"
          role="img"
          aria-label="Instagram: endereço a confirmar"
          title="Instagram: endereço a confirmar"
        >
          <InstagramIcon />
        </span>
      )}
      <a
        className="social-icon"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp do escritório"
        onClick={() => track('whatsapp_click')}
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
