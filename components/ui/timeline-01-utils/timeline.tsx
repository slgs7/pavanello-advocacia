'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  topics?: { title: string; href: string }[];
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const row = useRef<HTMLLIElement>(null);
  const inView = useInView(row, { margin: '-15% 0px -25% 0px' });
  const reduced = useReducedMotion();
  return (
    <li
      ref={row}
      className={`timeline-entry${inView ? ' is-active' : ''}`}
      id={item.id}
    >
      <div className="timeline-marker" aria-hidden="true">
        <span />
      </div>
      <div className="timeline-title">
        <h3>
          {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
        </h3>
        {item.href && (
          <Link className="timeline-area-link" href={item.href}>
            Conhecer esta área
          </Link>
        )}
      </div>
      <motion.div
        className="timeline-content"
        initial={false}
        animate={{ y: !reduced && !inView ? 12 : 0 }}
        transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>{item.description}</p>
        {item.topics && (
          <div
            className="timeline-topics"
            aria-label={`Assuntos de ${item.title}`}
          >
            {item.topics.map((topic) => (
              <Link href={topic.href} key={topic.href}>
                {topic.title}
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </li>
  );
}

// The supplied TimelineBlock01 imports this utility without including its source.
// This implementation retains its bordered, vertical composition and adds Motion.
export default function Timeline({ items }: { items: TimelineItem[] }) {
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 65%', 'end 65%'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  return (
    <div className="topic-timeline" ref={container}>
      <div className="timeline-track" aria-hidden="true">
        <motion.div
          className="timeline-progress"
          style={{ scaleY: reduced ? 1 : progress }}
        />
      </div>
      <ul className="timeline-list">
        {items.map((item) => (
          <TimelineEntry key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
