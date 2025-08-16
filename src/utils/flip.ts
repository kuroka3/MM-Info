export type FlipOptions = {
  container?: Element | string | null;
  itemSelector?: string;
  duration?: number;
  easing?: string;
  keyAttr?: string;
};

function resolveEl(target?: Element | string | null): Element | null {
  if (!target) return document.querySelector('.playlist-songs-popup');
  if (typeof target === 'string') return document.querySelector(target);
  return target;
}

export function animateReorder(apply: () => void, opts: FlipOptions = {}): void {
  const container = resolveEl(opts.container);
  if (!container) {
    apply();
    return;
  }

  const itemSelector = opts.itemSelector ?? '[data-slug]';
  const keyAttr = opts.keyAttr ?? 'data-slug';
  const duration = opts.duration ?? 500;
  const easing = opts.easing ?? 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';

  const before = new Map<string, DOMRect>();
  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
  items.forEach((el) => {
    const key = el.getAttribute(keyAttr) || '';
    if (key) before.set(key, el.getBoundingClientRect());
  });

  apply();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const afterItems = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      afterItems.forEach((el) => {
        const key = el.getAttribute(keyAttr) || '';
        const prev = before.get(key);
        if (!prev) return;
        const next = el.getBoundingClientRect();
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (!dx && !dy) return;
        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }],
          { duration, easing }
        );
      });
    });
  });
}
