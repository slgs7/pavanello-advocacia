'use client';
import { useSyncExternalStore, useState } from 'react';
import Script from 'next/script';
const subscribe = (fn: () => void) => {
  window.addEventListener('consent-change', fn);
  return () => window.removeEventListener('consent-change', fn);
};
const snapshot = () => localStorage.getItem('analytics-consent');
export function Consent() {
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  const [settings, setSettings] = useState(false);
  const id = process.env.NEXT_PUBLIC_GA4_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  function choose(value: string) {
    localStorage.setItem('analytics-consent', value);
    window.dispatchEvent(new Event('consent-change'));
    setSettings(false);
    if (value === 'denied' && consent === 'accepted') window.location.reload();
  }
  return (
    <>
      <button className="plain-button" onClick={() => setSettings(true)}>
        Preferências de cookies
      </button>
      {(!consent || settings) && (
        <aside
          className="cookie-banner"
          aria-label="Preferências de privacidade"
        >
          <h3>Sua privacidade importa.</h3>
          <p>
            Podemos usar medição de navegação para entender o uso do site? O
            formulário funciona com qualquer escolha.
          </p>
          <div className="button-row">
            <button
              className="button primary"
              onClick={() => choose('accepted')}
            >
              Aceitar medição
            </button>
            <button
              className="button secondary"
              onClick={() => choose('denied')}
            >
              Recusar
            </button>
          </div>
        </aside>
      )}
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}</Script>
        </>
      )}
    </>
  );
}
