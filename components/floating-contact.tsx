'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
export function FloatingContact() {
  const pathname = usePathname();
  const hasContactForm =
    pathname === '/' ||
    pathname === '/sobre' ||
    pathname === '/areas-de-atuacao' ||
    pathname.startsWith('/areas-de-atuacao/');
  const [visibleContactPath, setVisibleContactPath] = useState<string | null>(
    null,
  );
  useEffect(() => {
    const section = document.querySelector('#contato');
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisibleContactPath(entry.isIntersecting ? pathname : null),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);
  if (
    pathname.startsWith('/admin') ||
    pathname === '/contato' ||
    visibleContactPath === pathname
  )
    return null;
  return (
    <Link
      className="floating-contact"
      href={hasContactForm ? '#contato' : '/contato#contato'}
      aria-label="Iniciar atendimento pelo formulário"
      title="Fale conosco"
    >
      <MessageCircle size={22} />
    </Link>
  );
}
