'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Adapted from the fan carousel supplied by the client: text cards replace
// stock photography, while the seven fan positions and GSAP transitions remain.
export interface CardItem {
  id: string;
  author: string;
  text: string;
  rating: number;
  source: string;
  linkUrl: string;
}

const MAX_VISIBLE = 7;
export const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_DURATION = 1.15;
const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];
function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1;
}
function getSlotConfig(count: number, slot: number) {
  if (count >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = Math.floor(count / 2);
  const distance = center ? (slot - center) / center : 0;
  return {
    rot: distance * 21,
    scale: 1 - 0.2244 * distance * distance,
    x: distance * 30,
    y: distance * distance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}
function Rating({ value }: { value: number }) {
  return (
    <span
      className="review-stars"
      role="img"
      aria-label={`${value} de 5 estrelas`}
    >
      {Array.from({ length: value }, (_, index) => (
        <Star key={index} size={16} fill="currentColor" />
      ))}
    </span>
  );
}
function CardContent({
  card,
  active,
  onRead,
}: {
  card: CardItem;
  active: boolean;
  onRead: () => void;
}) {
  return (
    <>
      <div className="fan-card-author">
        <span className="review-avatar" aria-hidden="true">
          {card.author.charAt(0).toLocaleUpperCase('pt-BR')}
        </span>
        <div>
          <h3>{card.author}</h3>
          <span>Avaliação no {card.source}</span>
        </div>
      </div>
      <Rating value={card.rating} />
      <blockquote>{card.text}</blockquote>
      <button
        className="review-read"
        tabIndex={active ? 0 : -1}
        onClick={onRead}
      >
        Ler avaliação completa
      </button>
      <div className="fan-card-source">
        {card.source}
        <span>Depoimento de cliente</span>
      </div>
    </>
  );
}

export default function CardFanCarousel({ cards }: { cards: CardItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const previousVisible = useRef(new Set<number>());
  const directionRef = useRef<'left' | 'right'>('right');
  const [centerIndex, setCenterIndex] = useState(0);
  const [listView, setListView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openedCard, setOpenedCard] = useState<CardItem | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const reduced = useReducedMotion();
  const staticView = reduced || listView;
  const count = cards.length;
  const center = count ? centerIndex % count : 0;
  const cycle = useCallback(
    (direction: 'left' | 'right') => {
      if (count < 2) return;
      directionRef.current = direction;
      setCenterIndex(
        (previous) =>
          (previous + (direction === 'right' ? 1 : -1) + count) % count,
      );
    },
    [count],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [staticView]);

  useEffect(() => {
    if (
      staticView ||
      hovered ||
      focused ||
      openedCard ||
      !onScreen ||
      count < 2
    )
      return;
    const timer = setInterval(() => {
      if (!document.hidden) cycle('right');
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [staticView, hovered, focused, openedCard, onScreen, count, cycle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || staticView || !count) {
      previousVisible.current = new Set();
      return;
    }
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>('.fan-card'),
    );
    const visibleCount = Math.min(MAX_VISIBLE, count);
    const half = Math.floor(visibleCount / 2);
    const map = new Map<number, number>();
    for (let slot = 0; slot < visibleCount; slot++)
      map.set((center + slot - half + count) % count, slot);
    const before = previousVisible.current;
    const enteringFrom = directionRef.current === 'right' ? 1 : -1;
    const layout = (animate = true) => {
      const multiplier = getResponsiveMultiplier(container.clientWidth);
      elements.forEach((element, index) => {
        const slot = map.get(index);
        if (slot === undefined) {
          if (animate && before.has(index)) {
            gsap.to(element, {
              x: `${-enteringFrom * 44 * multiplier}rem`,
              y: `${9 * multiplier}rem`,
              rotation: -enteringFrom * 28,
              autoAlpha: 0,
              scale: 0.72,
              duration: TRANSITION_DURATION,
              ease: 'power2.inOut',
              overwrite: true,
            });
          } else gsap.set(element, { autoAlpha: 0, zIndex: 0 });
          return;
        }
        const target = getSlotConfig(visibleCount, slot);
        if (animate && !before.has(index)) {
          gsap.set(element, {
            x: `${enteringFrom * 44 * multiplier}rem`,
            y: `${9 * multiplier}rem`,
            rotation: enteringFrom * 28,
            scale: 0.72,
            autoAlpha: 0,
          });
        }
        gsap.set(element, { zIndex: target.zIndex });
        gsap.to(element, {
          x: `${target.x * multiplier}rem`,
          y: `${target.y * multiplier}rem`,
          rotation: target.rot,
          scale: target.scale,
          autoAlpha: 1,
          duration: animate ? TRANSITION_DURATION : 0,
          ease: 'power2.inOut',
          overwrite: true,
        });
      });
    };
    layout(before.size > 0);
    previousVisible.current = new Set(map.keys());
    let width = container.clientWidth;
    // ResizeObserver fires once upon observing. Do not let that notification
    // cancel an in-progress transition after every change of the center card.
    const resize = new ResizeObserver(() => {
      if (container.clientWidth !== width) {
        width = container.clientWidth;
        layout(false);
      }
    });
    resize.observe(container);
    return () => {
      resize.disconnect();
      gsap.killTweensOf(elements);
    };
  }, [center, count, staticView]);

  useEffect(() => {
    if (openedCard && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [openedCard]);
  function openCard(card: CardItem) {
    openerRef.current = document.activeElement as HTMLElement;
    setOpenedCard(card);
  }
  function closeCard() {
    dialogRef.current?.close();
    setOpenedCard(null);
    openerRef.current?.focus();
  }
  if (!count) return null;
  return (
    <div
      className="fan-carousel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Avaliações de clientes"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      {staticView ? (
        <>
          <div className="reviews-static" ref={containerRef}>
            {(expanded ? cards : cards.slice(0, 3)).map((card) => (
              <article className="review-static-card" key={card.id}>
                <CardContent card={card} active onRead={() => openCard(card)} />
              </article>
            ))}
          </div>
          {count > 3 && (
            <button
              className="button secondary"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? 'Mostrar menos avaliações'
                : 'Ver todas as avaliações'}
            </button>
          )}
          {!reduced && (
            <button
              className="text-link review-view-toggle"
              onClick={() => setListView(false)}
            >
              Voltar ao carrossel
            </button>
          )}
        </>
      ) : (
        <>
          <div ref={containerRef} className="fan-layout">
            {cards.map((card, index) => (
              <article
                key={card.id}
                className={`fan-card${index === center ? ' is-center' : ''}`}
                aria-hidden={index !== center}
              >
                <CardContent
                  card={card}
                  active={index === center}
                  onRead={() => openCard(card)}
                />
              </article>
            ))}
          </div>
          <div className="fan-controls">
            <button
              className="icon-button"
              aria-label="Avaliação anterior"
              onClick={() => cycle('left')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="icon-button"
              aria-label="Próxima avaliação"
              onClick={() => cycle('right')}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="fan-hint">
            <button
              className="text-link review-view-toggle"
              onClick={() => {
                setExpanded(true);
                setListView(true);
              }}
            >
              Ler todas sem movimento
            </button>
          </p>
          <span className="sr-only" aria-live={focused ? 'polite' : 'off'}>
            Avaliação de {cards[center].author}
          </span>
        </>
      )}
      <dialog
        ref={dialogRef}
        className="review-dialog"
        aria-labelledby="review-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeCard();
        }}
        onClose={() => setOpenedCard(null)}
      >
        {openedCard && (
          <>
            <div className="review-dialog-heading">
              <h3 id="review-dialog-title">{openedCard.author}</h3>
              <button
                className="icon-button"
                onClick={closeCard}
                aria-label="Fechar avaliação"
              >
                <X size={20} />
              </button>
            </div>
            <Rating value={openedCard.rating} />
            <blockquote>{openedCard.text}</blockquote>
            <a
              className="text-link"
              href={openedCard.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver a origem no Google Maps
            </a>
          </>
        )}
      </dialog>
    </div>
  );
}
