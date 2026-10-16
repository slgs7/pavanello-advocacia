import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FloatingContact } from '@/components/floating-contact';
import { siteConfig } from '@/site.config';
import './globals.css';
const body = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Advocacia em ${siteConfig.city} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    'Atendimento jurídico com escuta atenta e orientação clara. Conheça as áreas de atuação e converse com a equipe.',
  alternates: { canonical: '/' },
  openGraph: { locale: 'pt_BR', type: 'website', siteName: siteConfig.name },
  robots:
    process.env.NEXT_PUBLIC_SITE_READY === 'true'
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={body.variable}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
