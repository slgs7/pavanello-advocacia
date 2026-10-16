import { passos } from '@/content/institucional';
import Link from 'next/link';
export function Steps({ highlight = false }: { highlight?: boolean }) {
  return (
    <section
      className={highlight ? 'section steps-feature' : 'section light'}
      id={highlight ? 'como-atendemos' : undefined}
    >
      <div className="container">
        <div className="section-heading">
          <h2>
            Um caminho claro,
            <br />
            desde a primeira conversa.
          </h2>
          <p>
            Cada caso vai para o especialista da área. Você sabe como começa e o
            que acontece depois.
          </p>
        </div>
        <div className="steps">
          {passos.map((step, i) => (
            <div className="step" key={step.titulo}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{step.titulo}</h3>
                <p>{step.texto}</p>
              </div>
            </div>
          ))}
        </div>
        {highlight && (
          <div className="steps-invitation">
            <p>
              Você não precisa saber por onde começar.
              <br />
              <strong>É para isso que estamos aqui.</strong>
            </p>
            <Link href="#contato" className="button primary">
              Iniciar meu atendimento
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
