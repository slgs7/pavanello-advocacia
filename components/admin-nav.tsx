'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export function AdminNav() {
  const router = useRouter();
  const [error, setError] = useState('');
  return (
    <>
      <nav className="admin-nav" aria-label="Painel">
        <Link href="/admin/noticias">Notícias</Link>
        <Link href="/admin/avaliacoes">Avaliações</Link>
        <Link href="/admin/leads">Contatos recebidos</Link>
        <button
          className="plain-button"
          onClick={async () => {
            try {
              const r = await fetch('/api/auth/logout', { method: 'POST' });
              if (!r.ok) throw new Error();
              router.push('/admin/login');
              router.refresh();
            } catch {
              setError('Não foi possível sair. Tente novamente.');
            }
          }}
        >
          Sair do painel
        </button>
      </nav>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </>
  );
}
