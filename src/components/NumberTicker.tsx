"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  value: number;
  /** Output formatter — e.g. n => String(n).padStart(2, "0"). */
  format?: (n: number) => string;
  /** Animation duration in ms. */
  duration?: number;
  /** Delay before animation starts. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function NumberTicker({
  value,
  format = (n) => String(n),
  duration = 700,
  delay = 0,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState<string>(reduce ? format(value) : format(0));

  useEffect(() => {
    if (!inView || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing animated display to viewport entry / reduced-motion preference
      setDisplay(format(value));
      return;
    }
    const startAt = performance.now() + delay;
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(Math.round(eased * value)));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, format, duration, delay, reduce]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
