import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="small muted">Página não encontrada · 404</p>
        <h1>Essa página saiu de audiência e não voltou.</h1>
        <p className="lead muted">Vamos te levar de volta ao início.</p>
        <div className="button-row">
          <Link href="/" className="button primary">
            Voltar ao início
          </Link>
          <Link href="/contato" className="button secondary">
            Falar com a equipe
          </Link>
        </div>
      </div>
    </section>
  );
}
