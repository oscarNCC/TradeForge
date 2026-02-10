import { cloneElement, isValidElement, ReactElement } from 'react';
import { useInView } from '../hooks/useInView';

interface ChartInViewProps {
  children: ReactElement;
  /** Run chart animation only once after first time in view */
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Wraps a chart and passes playAnimation={true} only when the element is in the
 * viewport, so chart animations play on scroll-into-view. Charts mount / receive
 * playAnimation when the wrapper enters the viewport.
 */
export default function ChartInView({
  children,
  once = true,
  threshold = 0.15,
  rootMargin = '80px 0px 0px 0px',
}: ChartInViewProps) {
  const [ref, inView] = useInView({ once, threshold, rootMargin });

  if (!isValidElement(children)) return <>{children}</>;

  return (
    <div ref={ref} className="w-full h-full min-h-0">
      <div key={inView ? 'in-view' : 'out'} className="w-full h-full min-h-0">
        {cloneElement(children, { playAnimation: inView } as Record<string, unknown>)}
      </div>
    </div>
  );
}
