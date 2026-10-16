import Link from 'next/link';
import { areas } from '@/content/areas';
import TimelineBlock01 from '@/components/ui/timeline-01';
import { slugify } from '@/lib/slug';
export function AreasSection({ full = false }: { full?: boolean }) {
  return (
    <section className="section light" id="areas">
      <div className="container">
        <TimelineBlock01
          title={
            !full ? (
              <>
                Diferentes áreas.
                <br />O mesmo cuidado.
              </>
            ) : undefined
          }
          description="A vida não cabe em uma única área do direito. Encontre o assunto que faz parte do seu momento."
          items={(full ? areas : areas.slice(0, 6)).map((area) => ({
            id: area.slug,
            title: area.nome,
            description: area.resumo,
            href: `/areas-de-atuacao/${area.slug}`,
            topics: area.assuntos
              .slice(0, 3)
              .map((title) => ({
                title,
                href: `/areas-de-atuacao/${area.slug}#${slugify(title)}`,
              })),
          }))}
        />
        {!full && (
          <div className="section-bottom">
            <p className="small muted">
              Da vida pessoal aos negócios e ao campo.
            </p>
            <Link href="/areas-de-atuacao" className="text-link">
              Conheça todas as áreas de atuação
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
