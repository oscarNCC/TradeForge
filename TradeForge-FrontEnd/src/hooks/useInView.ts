import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInViewOptions {
  /** Run animation only once (stay true after first time in view) */
  once?: boolean;
  /** Fraction of element visible to trigger (0–1) */
  threshold?: number;
  /** Root margin e.g. '100px' to trigger slightly before fully in view */
  rootMargin?: string;
}

export function useInView(options: UseInViewOptions = {}) {
  const { once = true, threshold = 0.15, rootMargin = '0px' } = options;
  const [inView, setInView] = useState(false);
  const hasTriggered = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current = node;
    },
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        if (once && hasTriggered.current) {
          setInView(true);
          return;
        }
        if (isIntersecting) {
          hasTriggered.current = true;
          setInView(true);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return [setRef, inView] as const;
}
