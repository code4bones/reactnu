import { useEffect, useId, useRef } from "react";

export type NuCrtGlitchProps = {
  /** Average gap between glitch pulses, in ms. */
  intervalMs?: number;
  /** How long a single glitch pulse lasts, in ms. */
  durationMs?: number;
  /** When false, no pulses fire (filter defs stay mounted, inert). */
  enabled?: boolean;
  /**
   * CSS selector for the pool of candidate elements, scoped under an open
   * (non-minimized) window. Defaults to small leaf controls (buttons,
   * checkboxes, icons, rows) rather than whole windows — a single control
   * twitching in peripheral vision reads as a real fault; a whole window
   * warping reads as a demo effect.
   */
  targetSelector?: string;
  /**
   * Fraction of pulses (0-1) that target a whole open window instead of a
   * small leaf control from `targetSelector`. Falls back to the other pool
   * when the chosen one has no candidates (e.g. no windows open).
   */
  topLevelRatio?: number;
};

const DEFAULT_INTERVAL_MS = 3000;
const DEFAULT_DURATION_MS = 2500;
const DEFAULT_TOP_LEVEL_RATIO = 1 / 3;
const TOP_LEVEL_SELECTOR = ".nu-window:not([data-minimized])";
const DEFAULT_TARGET_SELECTOR = [
  ".nu-button",
  ".nu-command-button",
  ".nu-check-box",
  ".nu-glyph",
  ".nu-tree-view__icon",
  ".nu-tree-view__check-box",
  ".nu-list-view__row",
  ".nu-listbox__item"
]
  .map((selector) => `.nu-window:not([data-minimized]) ${selector}`)
  .join(", ");

/**
 * Renders a hidden SVG filter and periodically applies it, at full
 * intensity for a beat then fading back out, to one random small leaf
 * control (see `targetSelector`) inside a currently-open window — meant to
 * be caught only in peripheral vision, not watched. No two pulses share
 * the same noise seed, offsets, duration, or gap, so nothing about it
 * repeats often enough to read as decorative. Mount once anywhere in the
 * tree (e.g. alongside NuWindowProvider). Opt-in: renders nothing visible
 * on its own between pulses.
 */
function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function NuCrtGlitch({
  intervalMs = DEFAULT_INTERVAL_MS,
  durationMs = DEFAULT_DURATION_MS,
  enabled = true,
  targetSelector = DEFAULT_TARGET_SELECTOR,
  topLevelRatio = DEFAULT_TOP_LEVEL_RATIO
}: NuCrtGlitchProps) {
  const filterId = useId().replace(/:/g, "");
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const warpRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const rOffsetRef = useRef<SVGFEOffsetElement | null>(null);
  const bOffsetRef = useRef<SVGFEOffsetElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function stepPulse(
      startedAt: number,
      pulseDurationMs: number,
      warpPeak: number,
      rPeak: number,
      bPeak: number
    ) {
      const warp = warpRef.current;
      const rOffset = rOffsetRef.current;
      const bOffset = bOffsetRef.current;
      const targetEl = targetElRef.current;

      if (!warp || !rOffset || !bOffset || !targetEl) {
        return;
      }

      const t = (performance.now() - startedAt) / pulseDurationMs;

      if (t >= 1) {
        warp.setAttribute("scale", "0");
        rOffset.setAttribute("dx", "0");
        bOffset.setAttribute("dx", "0");
        targetEl.style.filter = "";
        targetElRef.current = null;
        rafRef.current = null;
        return;
      }

      const intensity = Math.sin(t * Math.PI);

      warp.setAttribute("scale", String(intensity * warpPeak));
      rOffset.setAttribute("dx", String(-intensity * rPeak));
      bOffset.setAttribute("dx", String(intensity * bPeak));
      rafRef.current = requestAnimationFrame(() =>
        stepPulse(startedAt, pulseDurationMs, warpPeak, rPeak, bPeak)
      );
    }

    function getLeafCandidates() {
      const rawCandidates = Array.from(
        document.querySelectorAll<HTMLElement>(targetSelector)
      );
      const rawCandidateSet = new Set<HTMLElement>(rawCandidates);

      // Selectors overlap (e.g. a glyph icon rendered inside a command
      // button): keep only the outermost match per cluster, since a nested
      // match glitches at the exact same screen spot as its ancestor and
      // reads as "the same control" firing over and over.
      return rawCandidates.filter((el) => {
        let ancestor = el.parentElement;

        while (ancestor) {
          if (rawCandidateSet.has(ancestor)) {
            return false;
          }

          ancestor = ancestor.parentElement;
        }

        return true;
      });
    }

    function firePulse() {
      const wantsTopLevel = Math.random() < topLevelRatio;
      const topLevelCandidates = Array.from(
        document.querySelectorAll<HTMLElement>(TOP_LEVEL_SELECTOR)
      );
      const leafCandidates = getLeafCandidates();

      // Prefer the rolled pool; fall back to the other one if it's empty
      // (e.g. no windows open yet, or every window is a single bare pane
      // with no leaf controls in it) rather than skipping the pulse.
      const candidates =
        wantsTopLevel && topLevelCandidates.length > 0
          ? topLevelCandidates
          : leafCandidates.length > 0
            ? leafCandidates
            : topLevelCandidates;

      if (candidates.length === 0) {
        return;
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (targetElRef.current) {
        targetElRef.current.style.filter = "";
      }

      const target = candidates[Math.floor(Math.random() * candidates.length)];

      if (!target) {
        return;
      }

      // Re-roll the noise pattern and pulse strength every time so no two
      // glitches look identical (a fixed offset/shape reads as decorative
      // and gives away the trick — real signal noise never repeats).
      turbulenceRef.current?.setAttribute(
        "baseFrequency",
        `${randomBetween(0.0006, 0.0016)} ${randomBetween(0.025, 0.07)}`
      );
      turbulenceRef.current?.setAttribute(
        "seed",
        String(Math.floor(randomBetween(1, 999)))
      );

      const pulseDurationMs = durationMs * randomBetween(0.7, 1.4);
      const warpPeak = randomBetween(2.5, 8);
      const rPeak = randomBetween(1.5, 5.5);
      const bPeak = randomBetween(1.5, 5.5);

      targetElRef.current = target;
      target.style.filter = `url(#${filterId})`;
      rafRef.current = requestAnimationFrame(() =>
        stepPulse(performance.now(), pulseDurationMs, warpPeak, rPeak, bPeak)
      );
    }

    let timer: number;

    // Self-rescheduling with a jittered delay (not setInterval) so pulses
    // don't fall into a detectable fixed-cadence beat either.
    function scheduleNext() {
      timer = window.setTimeout(() => {
        firePulse();
        scheduleNext();
      }, randomBetween(intervalMs * 0.6, intervalMs * 1.6));
    }

    scheduleNext();

    return () => {
      window.clearTimeout(timer);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (targetElRef.current) {
        targetElRef.current.style.filter = "";
      }
    };
  }, [durationMs, enabled, filterId, intervalMs, targetSelector, topLevelRatio]);

  return (
    <svg aria-hidden="true" height="0" style={{ position: "absolute" }} width="0">
      <defs>
        <filter
          color-interpolation-filters="sRGB"
          height="110%"
          id={filterId}
          width="130%"
          x="-15%"
          y="-5%"
        >
          <feTurbulence
            baseFrequency="0.001 0.045"
            numOctaves={1}
            ref={turbulenceRef}
            result="bands"
            seed={7}
            type="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="bands"
            ref={warpRef}
            result="warped"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="A"
          />
          <feOffset dx={0} dy={0} in="warped" ref={rOffsetRef} result="rOff" />
          <feColorMatrix
            in="rOff"
            result="rOnly"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          />
          <feColorMatrix
            in="warped"
            result="gOnly"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
          />
          <feOffset dx={0} dy={0} in="warped" ref={bOffsetRef} result="bOff" />
          <feColorMatrix
            in="bOff"
            result="bOnly"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
          <feBlend in="rOnly" in2="gOnly" mode="screen" result="rg" />
          <feBlend in="rg" in2="bOnly" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
