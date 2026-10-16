import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { ImageSlot } from '@/components/image-slot';
import { Steps } from '@/components/steps';
import { ContactSection } from '@/components/contact-section';
import { pageMetadata } from '@/components/seo';
import { siteConfig, isDevelopment } from '@/site.config';
export const metadata = pageMetadata(
  'Quem somos',
  'Conheça a Pavanello Advogados e nossa forma de atender em Rio Verde.',
  '/sobre',
);
export default function Sobre() {
  return (
    <>
      <PageIntro
        title="Antes de um caso, existe uma história."
        description="Uma advocacia feita de escuta, clareza e proximidade."
        crumbs={[{ label: 'Quem somos', href: '/sobre' }]}
      />
      <section className="section light">
        <div className="container split-content">
          <div className="prose">
            <h2>O seu momento merece atenção.</h2>
            <p>
              A {siteConfig.name} está em {siteConfig.city}, {siteConfig.state},
              e reúne atendimento em diferentes áreas do direito.
            </p>
            <p>
              Nossa forma de trabalho começa por entender a situação. A equipe
              direciona cada demanda ao advogado da área e organiza o
              atendimento conforme a disponibilidade dos profissionais.
            </p>
            <p>
              Assim, você tem um primeiro contato claro: quem vai ouvir o caso,
              quais informações são necessárias e como continuar a conversa.
            </p>
            {isDevelopment && (
              <p className="pending">
                [PENDENTE: nome da coordenadora e história institucional
                aprovada]
              </p>
            )}
            <Link href="/contato" className="button secondary">
              Fale com a equipe
            </Link>
          </div>
          <ImageSlot portrait label="Espaço para retrato da coordenadora" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Clareza em cada conversa.</h2>
          <p className="lead muted">
            Atendimento responsável, linguagem acessível e respeito ao contexto
            de cada pessoa.
          </p>
        </div>
      </section>
      <Steps />
      <ContactSection />
    </>
  );
}
