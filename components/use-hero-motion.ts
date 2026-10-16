'use client';

import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { heroMotion as motion } from '@/lib/hero-motion';

export function useHeroMotion(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    document.documentElement.classList.add('js');
    const media = gsap.matchMedia();
    const headerBrand = document.querySelector<HTMLElement>(
      '.site-header .brand',
    );
    const find = (selector: string) =>
      hero.querySelector<HTMLElement>(selector);

    // SSR stays visible. Only a successfully initialized effect can hide content.
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const tokens = mobile ? motion.mobile : motion.desktop;
      const title = find('h1');
      const card = find('.hero-card-enter');
      const note = find('.portrait-note');
      const brands = [headerBrand, find('.identity-lockup')].filter(
        (element): element is HTMLElement => Boolean(element),
      );
      const ghosts: HTMLElement[] = [];
      const enterElements =
        hero.querySelectorAll<HTMLElement>('[data-hero-enter]');
      let split: SplitText | undefined;

      try {
        // A static 8px blurred copy fades out; filter itself is never animated.
        brands.forEach((brand) => {
          const delay = brand === headerBrand ? 0 : motion.cardDelay;
          const original = Array.from(brand.children) as HTMLElement[];
          const ghost = document.createElement('span');
          ghost.className = 'hero-brand-soft';
          ghost.setAttribute('aria-hidden', 'true');
          ghost.inert = true;
          original.forEach((child) => ghost.append(child.cloneNode(true)));
          brand.append(ghost);
          ghosts.push(ghost);
          brand.dataset.heroBrand = 'ready';

          gsap.fromTo(
            brand,
            { scale: motion.scale.brand, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: tokens.brandDuration,
              ease: motion.ease.enter,
              delay,
              onStart: () => {
                brand.style.willChange = 'transform, opacity';
              },
              onComplete: () => {
                delete brand.dataset.heroBrand;
                gsap.set(brand, { clearProps: 'transform,opacity,willChange' });
              },
            },
          );
          gsap.from(original, {
            opacity: 0,
            duration: tokens.brandDuration,
            ease: motion.ease.enter,
            delay,
            onComplete: () => {
              gsap.set(original, { clearProps: 'opacity' });
            },
          });
          gsap.to(ghost, {
            opacity: 0,
            duration: tokens.brandDuration,
            ease: motion.ease.enter,
            delay,
          });
        });

        let lineCount = 1;
        if (title) {
          split = SplitText.create(title, {
            type: 'lines',
            linesClass: 'hero-title-line',
            autoSplit: true,
            aria: 'auto',
            onSplit(self) {
              lineCount = self.lines.length;
              return gsap.fromTo(
                self.lines,
                { y: motion.distance.text, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  delay: tokens.brandDuration + tokens.stagger,
                  stagger: tokens.stagger,
                  duration: motion.duration.enter,
                  ease: motion.ease.enter,
                  onStart: () => {
                    gsap.set(self.lines, { willChange: 'transform,opacity' });
                  },
                  onComplete: () => {
                    gsap.set(self.lines, {
                      clearProps: 'transform,opacity,willChange',
                    });
                  },
                },
              );
            },
          });
        }

        const entrance = gsap.timeline({
          defaults: {
            duration: motion.duration.enter,
            ease: motion.ease.enter,
          },
          onComplete: () => {
            delete hero.dataset.heroMotion;
            gsap.set(enterElements, {
              clearProps: 'transform,opacity,willChange',
            });
          },
        });
        const reveal = (element: HTMLElement | null, at: number) => {
          if (!element) return;
          entrance.fromTo(
            element,
            { y: motion.distance.text, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              onStart: () => {
                element.style.willChange = 'transform, opacity';
              },
              onComplete: () => {
                gsap.set(element, { clearProps: 'willChange' });
              },
            },
            at,
          );
        };
        reveal(find('.hero-location'), tokens.brandDuration);
        const subtitleAt =
          tokens.brandDuration + tokens.stagger * (lineCount + 1);
        reveal(find('.lead'), subtitleAt);
        reveal(find('.button-row'), subtitleAt + tokens.stagger);
        reveal(find('.hero-proof'), subtitleAt + tokens.stagger * 2);
        if (card) {
          entrance.fromTo(
            card,
            { y: motion.distance.card, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: motion.duration.card,
              onStart: () => {
                card.style.willChange = 'transform, opacity';
              },
              onComplete: () => {
                gsap.set(card, { clearProps: 'willChange' });
              },
            },
            motion.cardDelay,
          );
        }
        if (note) {
          entrance.fromTo(
            note,
            { y: motion.distance.note, opacity: 0, scale: motion.scale.note },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: motion.duration.note,
              ease: motion.ease.note,
              onStart: () => {
                note.style.willChange = 'transform, opacity';
              },
              onComplete: () => {
                gsap.set(note, { clearProps: 'willChange' });
              },
            },
            subtitleAt + tokens.stagger * 2 + motion.duration.enter,
          );
        }
        hero.dataset.heroMotion = 'ready';
      } catch {
        // A failed enhancement must never leave the headline or links hidden.
        split?.revert();
        const affected = [
          ...hero.querySelectorAll<HTMLElement>('*'),
          ...brands,
          ...(headerBrand?.querySelectorAll<HTMLElement>('*') ?? []),
        ];
        gsap.killTweensOf(affected);
        gsap.set(affected, {
          clearProps: 'transform,opacity,willChange',
        });
        ghosts.forEach((ghost) => ghost.remove());
        brands.forEach((brand) => {
          delete brand.dataset.heroBrand;
        });
        delete hero.dataset.heroMotion;
      }

      return () => {
        split?.revert();
        ghosts.forEach((ghost) => ghost.remove());
        brands.forEach((brand) => {
          delete brand.dataset.heroBrand;
        });
        delete hero.dataset.heroMotion;
      };
    });

    media.add(
      {
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions?.reduce) return;
        const tokens = context.conditions?.mobile
          ? motion.mobile
          : motion.desktop;
        const layers = [
          find('.hero-copy'),
          find('.hero-card-scroll'),
          find('.hero-watermark'),
        ];
        const markLayers = (active: boolean) => {
          layers.forEach((layer, index) => {
            if (layer)
              layer.style.willChange = active
                ? index === 0
                  ? 'transform, opacity'
                  : 'transform'
                : 'auto';
          });
        };
        gsap
          .timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: motion.scrub,
              invalidateOnRefresh: true,
              onUpdate: () => markLayers(true),
              onScrubComplete: () => markLayers(false),
            },
          })
          .to(
            layers[0],
            { y: tokens.copyY, opacity: motion.endOpacity, ease: 'none' },
            0,
          )
          .to(layers[1], { y: tokens.cardY, ease: 'none' }, 0)
          .to(layers[2], { y: tokens.leavesY, ease: 'none' }, 0);

        return () => markLayers(false);
      },
    );

    return () => media.revert();
  }, [ref]);
}
