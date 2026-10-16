import { ImageResponse } from 'next/og';
import { siteConfig } from '@/site.config';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Pavanello Advogados — Rio Verde, GO';
export default function OpenGraph() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#14100B',
        color: '#F2EBDC',
        width: '100%',
        height: '100%',
        padding: 96,
      }}
    >
      <div style={{ fontSize: 28, color: '#DBB857', marginBottom: 48 }}>
        {`${siteConfig.name} · ${siteConfig.city}, ${siteConfig.state}`}
      </div>
      <div style={{ fontSize: 72, fontFamily: 'serif', maxWidth: 900 }}>
        Cada caso, o advogado da área.
      </div>
      <div style={{ fontSize: 28, marginTop: 48 }}>
        Escuta atenta. Orientação clara.
      </div>
    </div>,
    size,
  );
}
