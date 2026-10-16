import { PageIntro } from '@/components/page-intro';
import { siteConfig, isDevelopment } from '@/site.config';
import { pageMetadata } from '@/components/seo';
export const metadata = pageMetadata(
  'Aviso legal',
  'Informações sobre a finalidade do conteúdo do site.',
  '/aviso-legal',
);
export default function Aviso() {
  return (
    <>
      <PageIntro
        title="Informação com responsabilidade."
        crumbs={[{ label: 'Aviso legal', href: '/aviso-legal' }]}
      />
      <section className="section light">
        <div className="container prose">
          <p>{siteConfig.disclaimer}</p>
          {isDevelopment && (
            <p className="pending">
              [PENDENTE: identificação da sociedade e inscrição do responsável
              na OAB]
            </p>
          )}
          <p>
            {siteConfig.name}
            <br />
            {siteConfig.address}
          </p>
        </div>
      </section>
    </>
  );
}
