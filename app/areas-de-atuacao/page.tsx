import { PageIntro } from '@/components/page-intro';
import { AreasSection } from '@/components/areas-section';
import { ContactSection } from '@/components/contact-section';
import { pageMetadata } from '@/components/seo';
export const metadata = pageMetadata(
  'Áreas de atuação em Rio Verde',
  'Conheça as áreas de atuação do escritório e encontre orientação para o seu assunto.',
  '/areas-de-atuacao',
);
export default function Areas() {
  return (
    <>
      <PageIntro
        title="Cada caso, o advogado da área."
        description="Diferentes necessidades pedem olhares específicos. Encontre a área relacionada ao seu momento."
        crumbs={[{ label: 'Áreas de atuação', href: '/areas-de-atuacao' }]}
      />
      <AreasSection full />
      <ContactSection />
    </>
  );
}
