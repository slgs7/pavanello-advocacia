// Motion values requested for the landing hero. Distances are pixels, times seconds.
export const heroMotion = {
  desktop: {
    brandDuration: 1.2,
    stagger: 0.12,
    copyY: -80,
    cardY: -120,
    leavesY: -30,
  },
  mobile: {
    brandDuration: 0.9,
    stagger: 0.08,
    copyY: -40,
    cardY: -60,
    leavesY: -15,
  },
  duration: { enter: 0.8, card: 1, note: 0.7 },
  distance: { text: 30, card: 40, note: 16 },
  scale: { brand: 0.92, note: 0.97 },
  ease: { enter: 'power3.out', note: 'back.out(1.6)' },
  cardDelay: 0.3,
  scrub: 0.6,
  endOpacity: 0.3,
} as const;
