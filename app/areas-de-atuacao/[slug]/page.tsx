import { notFound } from 'next/navigation';
import Link from 'next/link';
import { areas } from '@/content/areas';
import { obterArea } from '@/lib/data/areas';
import { PageIntro } from '@/components/page-intro';
import { Steps } from '@/components/steps';
import { NewsSection } from '@/components/news-section';
import { ContactSection } from '@/components/contact-section';
import { pageMetadata } from '@/components/seo';
import { listarNoticias } from '@/lib/data/noticias';
import { isDevelopment, siteConfig } from '@/site.config';
import TimelineBlock01 from '@/components/ui/timeline-01';
import { temasAreas } from '@/content/temas-areas';
import { slugify } from '@/lib/slug';
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = await obterArea((await params).slug);
  return a
    ? {
        ...pageMetadata(
          `${a.nome} em ${siteConfig.city}`,
          a.resumo,
          `/areas-de-atuacao/${a.slug}`,
        ),
        robots: !a.revisado ? { index: false, follow: true } : undefined,
      }
    : {};
}
export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const area = await obterArea((await params).slug);
  if (!area) notFound();
  const news = (await listarNoticias()).filter((n) => n.area === area.slug);
  const show = area.revisado || isDevelopment;
  return (
    <>
      <PageIntro
        title={`${area.nome} em ${siteConfig.city}`}
        description={area.resumo}
        crumbs={[
          { label: 'Áreas de atuação', href: '/areas-de-atuacao' },
          { label: area.nome, href: `/areas-de-atuacao/${area.slug}` },
        ]}
      />
      <section className="section light">
        <div className="container">
          {isDevelopment && !area.revisado && (
            <p className="pending">Texto aguardando revisão do escritório</p>
          )}
          {show ? (
            <>
              <TimelineBlock01
                title={
                  <>
                    Situações em que
                    <br />
                    podemos ajudar.
                  </>
                }
                description="Entenda um pouco mais sobre cada assunto. A análise individual orienta o atendimento e os próximos passos."
                items={area.assuntos.map((title) => ({
                  id: slugify(title),
                  title,
                  description:
                    temasAreas[title] &&
                    (isDevelopment || temasAreas[title].revisado)
                      ? temasAreas[title].descricao
                      : 'Converse com a equipe para entender o atendimento neste assunto.',
                }))}
              />
            </>
          ) : (
            <>
              <h2>Converse com a equipe.</h2>
              <p>
                Para conhecer o atendimento nesta área, entre em contato com o
                escritório.
              </p>
            </>
          )}
          <div className="button-row">
            <Link
              href={`/contato?area=${area.slug}`}
              className="button secondary"
            >
              Conversar sobre este assunto
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Seu caso começa com escuta.</h2>
          <p className="lead muted">
            A equipe identifica o assunto e direciona o contato ao advogado da
            área, de acordo com a disponibilidade.
          </p>
        </div>
      </section>
      <Steps />
      {show && (
        <section
          className="section light"
          style={{ background: 'var(--ivory-200)' }}
        >
          <div className="container prose">
            <h2>Perguntas frequentes</h2>
            <details className="faq">
              <summary>Como começar o atendimento?</summary>
              <p>
                Preencha o formulário ou fale pelo WhatsApp. A equipe vai ouvir
                sua solicitação e explicar como funciona o próximo contato.
              </p>
            </details>
            <details className="faq">
              <summary>Quais documentos devo separar?</summary>
              <p>
                A documentação depende do assunto. Descreva brevemente a
                situação no contato inicial; o advogado indicará quais
                informações são necessárias para a análise.
              </p>
            </details>
            <details className="faq">
              <summary>O contato pelo site já inicia um processo?</summary>
              <p>
                Não. O contato inicial permite entender a solicitação. A atuação
                profissional depende de análise e dos ajustes específicos com o
                escritório.
              </p>
            </details>
          </div>
        </section>
      )}
      {news.length > 0 && <NewsSection items={news} />}
      <ContactSection initialArea={area.slug} />
    </>
  );
}
