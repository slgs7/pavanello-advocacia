import { PageIntro } from '@/components/page-intro';
import { ContactSection } from '@/components/contact-section';
import { LegalService, pageMetadata } from '@/components/seo';
import { areas } from '@/content/areas';
export const metadata = pageMetadata(
  'Contato',
  'Converse com a equipe. Encontre endereço, telefone e o formulário de atendimento.',
  '/contato',
);
export default async function Contato({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const valid = areas.some((a) => a.slug === area) ? area : undefined;
  return (
    <>
      <LegalService />
      <PageIntro
        title="Vamos entender seu caso."
        description="Conte o que precisa. O próximo passo começa aqui."
        crumbs={[{ label: 'Contato', href: '/contato' }]}
      />
      <ContactSection initialArea={valid} />
    </>
  );
}
