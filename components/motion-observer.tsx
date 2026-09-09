'use client';

import { useEffect } from 'react';

export function MotionObserver() {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]')
        .forEach((element) => {
          if (observed.has(element)) return;
          observed.add(element);
          if (reducedMotion) {
            element.classList.add('is-visible');
            return;
          }
          element.classList.add('reveal-ready');
          const bounds = element.getBoundingClientRect();
          if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
            element.classList.add('is-visible');
            return;
          }
          observer.observe(element);
        });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
