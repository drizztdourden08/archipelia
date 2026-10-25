/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { SEEN_DWELL_MS } from '../GameStore.constants';

const useSeen = (ref: RefObject<Element | null>): boolean => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      clearTimeout(timer);
      if (entries.some((entry) => entry.isIntersecting)) timer = setTimeout(() => setSeen(true), SEEN_DWELL_MS);
    });
    observer.observe(node);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [ref, seen]);
  return seen;
};

export { useSeen };
