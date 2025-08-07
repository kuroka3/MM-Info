function easeInOutQuad(t: number) {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

export function scrollToPosition(target: number, duration = 250) {
  const start = window.scrollY;
  const diff = target - start;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const raw = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(raw);
    window.scrollTo(0, start + diff * eased);
    if (raw < 1) {
      requestAnimationFrame(step);
    } else {
      html.style.scrollBehavior = prev;
    }
  }

  requestAnimationFrame(step);
}
