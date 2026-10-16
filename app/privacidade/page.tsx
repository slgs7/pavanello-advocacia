import { PageIntro } from '@/components/page-intro';
import { privacidade } from '@/content/institucional';
import { isDevelopment, siteConfig } from '@/site.config';
import { pageMetadata } from '@/components/seo';
export const metadata = {
  ...pageMetadata(
    'Privacidade',
    'Como tratamos os dados recebidos pelo site.',
    '/privacidade',
  ),
  robots: { index: false, follow: true },
};
export default function Privacidade() {
  return (
    <>
      <PageIntro
        title="Política de privacidade"
        crumbs={[{ label: 'Privacidade', href: '/privacidade' }]}
      />
      <section className="section light">
        <div className="container prose">
          {!privacidade.revisado && (
            <p className="pending">
              {isDevelopment
                ? 'Texto aguardando revisão do escritório'
                : 'A política detalhada está em preparação. Consulte o escritório antes de enviar informações sensíveis.'}
            </p>
          )}
          {(privacidade.revisado || isDevelopment) &&
            privacidade.paragrafos.map((p, i) => <p key={i}>{p}</p>)}
          {isDevelopment && (
            <p className="pending">
              [PENDENTE: responsável pelo tratamento, retenção e revisão
              jurídica]
            </p>
          )}
          <h2>Contato sobre seus dados</h2>
          <a className="text-link" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
      </section>
    </>
  );
}
