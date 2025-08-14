import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * cm-map에 대한 mobile 세로모드 legacy code
 * 나중에 쓸수도 있을까 싶어서 보관
 */
export default function usePortraitMapRotation(
  wrapperRef: RefObject<HTMLDivElement>,
  rotatorRef: RefObject<HTMLDivElement>,
) {
  const raf = useRef<number | null>(null);
  const prevViewportWidth = useRef(0);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const rotator = rotatorRef.current;
    if (!wrapper || !rotator) return;

    const applyRotation = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      const vh = vv?.height ?? window.innerHeight;
      const isNarrow = vw <= 480;

      if (isNarrow) {
        const container = (wrapper.closest('.cm-main') as HTMLElement) || document.body;
        const ww = container.clientWidth || vw;
        const ratio = vh / vw;
        const margin = ww * 0.08;

        wrapper.style.position = 'relative';
        wrapper.style.left = '';
        wrapper.style.top = '';
        wrapper.style.transform = '';
        wrapper.style.margin = '0 auto';
        wrapper.style.width = `${ww}px`;
        wrapper.style.height = `${ww * ratio}px`;
        wrapper.style.padding = `${margin}px`;
        wrapper.style.overflow = 'hidden';

        rotator.style.position = 'absolute';
        rotator.style.left = '50%';
        rotator.style.top = '50%';
        rotator.style.width = `${ww * ratio - margin * 2}px`;
        rotator.style.height = `${ww - margin * 2}px`;
        rotator.style.transformOrigin = 'center';
        rotator.style.transform = 'translate(-50%, -50%) rotate(90deg)';
        rotator.setAttribute('data-rotated', '1');
      } else {
        wrapper.removeAttribute('style');
        rotator.removeAttribute('style');
        rotator.removeAttribute('data-rotated');
      }
    };

    const schedule = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      if (Math.abs(prevViewportWidth.current - vw) < 1) return;
      prevViewportWidth.current = vw;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(applyRotation);
    };

    schedule();

    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
    };
  }, [wrapperRef, rotatorRef]);
}
