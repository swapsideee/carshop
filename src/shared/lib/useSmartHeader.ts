'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type SmartHeaderOptions = {
  topRevealY?: number;
  scrolledY?: number;

  hideAfterDownPx?: number;
  showAfterUpPx?: number;

  hideVelocity?: number;
  showVelocity?: number;

  idleMs?: number;
  decisionCooldownMs?: number;

  rafThrottle?: boolean;
};

const DEFAULTS: Required<SmartHeaderOptions> = {
  topRevealY: 24,
  scrolledY: 10,

  hideAfterDownPx: 64,
  showAfterUpPx: 18,

  hideVelocity: 220,
  showVelocity: -180,

  idleMs: 120,
  decisionCooldownMs: 90,

  rafThrottle: true,
};

type RefsState = {
  lastY: number;
  downAcc: number;
  upAcc: number;
  lastDecisionAt: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
  raf: number;
  latest: number;
};

export function useSmartHeader(
  menuOpen: boolean,
  opts: SmartHeaderOptions = {},
): { hidden: boolean; scrolled: boolean } {
  const cfg = { ...DEFAULTS, ...opts };

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();

  const refs = useRef<RefsState>({
    lastY: 0,
    downAcc: 0,
    upAcc: 0,
    lastDecisionAt: 0,
    idleTimer: null,
    raf: 0,
    latest: 0,
  });

  const resetAcc = () => {
    refs.current.downAcc = 0;
    refs.current.upAcc = 0;
  };

  const reveal = () => {
    resetAcc();
    setHidden(false);
  };

  const hide = () => {
    resetAcc();
    setHidden(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > cfg.scrolledY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cfg.scrolledY]);

  useEffect(() => {
    if (!menuOpen) return;

    const r = refs.current;
    resetAcc();
    r.lastY = r.latest;
    r.lastDecisionAt = performance.now();

    if (r.idleTimer) clearTimeout(r.idleTimer);
  }, [menuOpen]);

  const scheduleRevealOnIdle = () => {
    const r = refs.current;

    if (r.idleTimer) clearTimeout(r.idleTimer);

    r.idleTimer = setTimeout(() => {
      if (!menuOpen) reveal();
    }, cfg.idleMs);
  };

  const decide = () => {
    const r = refs.current;
    const latest = r.latest;
    const last = r.lastY;

    r.lastY = latest;

    if (latest <= cfg.topRevealY) {
      reveal();
      return;
    }

    if (menuOpen) {
      reveal();
      return;
    }

    scheduleRevealOnIdle();

    const delta = latest - last;
    const dir = delta === 0 ? 0 : delta > 0 ? 1 : -1;

    if (dir > 0) {
      r.downAcc += delta;
      r.upAcc = 0;
    } else if (dir < 0) {
      r.upAcc += -delta;
      r.downAcc = 0;
    }

    const v = scrollY.getVelocity();
    const now = performance.now();
    if (now - r.lastDecisionAt < cfg.decisionCooldownMs) return;

    const shouldHideByDistance = r.downAcc >= cfg.hideAfterDownPx;
    const shouldShowByDistance = r.upAcc >= cfg.showAfterUpPx;

    const shouldHideByVelocity = v >= cfg.hideVelocity;
    const shouldShowByVelocity = v <= cfg.showVelocity;

    if (!hidden && (shouldHideByVelocity || shouldHideByDistance)) {
      r.lastDecisionAt = now;
      hide();
      return;
    }

    if (hidden && (shouldShowByVelocity || shouldShowByDistance)) {
      r.lastDecisionAt = now;
      reveal();
      return;
    }
  };

  useMotionValueEvent(scrollY, 'change', (latest: number) => {
    const r = refs.current;
    r.latest = latest;

    if (!cfg.rafThrottle) {
      decide();
      return;
    }

    if (r.raf) return;

    r.raf = requestAnimationFrame(() => {
      r.raf = 0;
      decide();
    });
  });

  useEffect(
    () => () => {
      const r = refs.current;
      if (r.raf) cancelAnimationFrame(r.raf);
      if (r.idleTimer) clearTimeout(r.idleTimer);
    },
    [],
  );

  const hiddenForUI = menuOpen ? false : hidden;

  return { hidden: hiddenForUI, scrolled };
}
