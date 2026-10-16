'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Login() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = Object.fromEntries(new FormData(e.currentTarget));
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push('/admin/noticias');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="prose">
      <h1>Painel do escritório</h1>
      <p className="lead muted">
        Notícias, avaliações e contatos em um só lugar.
      </p>
      {!configured && (
        <div className="panel">
          <h3>Falta conectar o banco.</h3>
          <p className="muted">
            A interface está pronta. Configure as variáveis do Supabase, execute
            a migração e cadastre os e-mails autorizados para ativar o painel.
          </p>
          <p className="small muted">
            O passo a passo está em docs/desenvolvimento.md.
          </p>
        </div>
      )}
      <form onSubmit={login} className="panel">
        <div className="field">
          <label htmlFor="email">E-mail autorizado</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary" disabled={busy || !configured}>
          {busy ? 'Entrando…' : 'Entrar no painel'}
        </button>
        <p className="form-note">
          Acesso exclusivo da equipe. Para recuperar a senha, contate o
          responsável pelo painel.
        </p>
      </form>
    </div>
  );
}
