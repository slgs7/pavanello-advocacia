'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Brand } from './brand';
import { SocialLinks } from './social-links';
const links = [
  ['/areas-de-atuacao', 'Áreas de atuação'],
  ['/sobre', 'Quem somos'],
  ['/noticias', 'Notícias'],
  ['/contato', 'Contato'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nav.current?.querySelector('a')?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === 'Tab') {
        const elements = [
          button.current,
          ...Array.from(
            nav.current?.querySelectorAll<HTMLAnchorElement>('a') || [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  const items = links.map(([href, label]) => (
    <Link
      href={href}
      key={href}
      aria-current={pathname === href ? 'page' : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  ));
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Principal">
          {items}
          <SocialLinks />
        </nav>
        <button
          ref={button}
          className="menu-button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        {open && (
          <nav
            ref={nav}
            id="menu-mobile"
            className="mobile-nav"
            aria-label="Menu móvel"
          >
            {items}
            <SocialLinks />
            <Link
              className="button primary"
              href={pathname === '/' ? '#contato' : '/contato#contato'}
              onClick={() => setOpen(false)}
            >
              Fale conosco
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
