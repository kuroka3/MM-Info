let redirecting = false;

export const SPOILER_REDIRECT_DELAY = 450;

type RedirectOptions = {
  startDelay?: number;
};

export function triggerSpoilerRedirect(path: string | undefined, options: RedirectOptions = {}) {
  if (typeof window === 'undefined' || !path) return;
  if (redirecting) {
    window.location.href = path;
    return;
  }

  redirecting = true;

  const { document } = window;
  const body = document.body;
  const startDelay = options.startDelay ?? 0;

  const startTransition = () => {
    body.classList.add('spoiler-redirecting');

    let overlay = document.querySelector<HTMLDivElement>('.spoiler-redirect-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'spoiler-redirect-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      body.appendChild(overlay);
      requestAnimationFrame(() => overlay?.classList.add('visible'));
    } else {
      overlay.classList.add('visible');
    }

    window.setTimeout(() => {
      window.location.href = path;
    }, SPOILER_REDIRECT_DELAY);
  };

  if (startDelay > 0) {
    window.setTimeout(startTransition, startDelay);
  } else {
    startTransition();
  }
}
