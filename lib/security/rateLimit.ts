'use client';
/**
 * lib/security/rateLimit.ts
 *
 * Client-side rate limiting and debounce hooks for Bitium Technology.
 *
 * OWASP Coverage:
 *  - A07 Identification & Authentication Failures:
 *      useRateLimit() prevents bot-driven form spam (checkout flooding,
 *      WhatsApp link abuse, Cloudinary upload DoS)
 *  - A03 Injection (search flooding):
 *      useDebounce() prevents API hammering via rapid search input
 */

import { useRef, useCallback, useState, useEffect } from 'react';

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

export interface RateLimitOptions {
  /** Maximum calls allowed within the time window */
  maxCalls: number;
  /** Time window duration in milliseconds */
  windowMs: number;
  /** Optional callback invoked when the rate limit is exceeded */
  onLimitReached?: (resetInSeconds: number) => void;
}

export interface RateLimitState {
  /** True while the user is rate-limited (cooldown active) */
  isLimited: boolean;
  /** Remaining allowed calls in the current window */
  remaining: number;
  /** Seconds until the rate limit resets (0 when not limited) */
  resetInSeconds: number;
}

/**
 * useRateLimit — React hook that wraps any async/sync handler and prevents
 * it from being called more than `maxCalls` times within `windowMs` ms.
 *
 * Returns the guarded handler plus live limit state for UI feedback.
 *
 * @example
 * const { guarded, isLimited, resetInSeconds } = useRateLimit({
 *   maxCalls: 3,
 *   windowMs: 60_000,         // max 3 submissions per minute
 *   onLimitReached: (s) => toast.error(`Please wait ${s}s`),
 * });
 *
 * <button onClick={guarded(handleCheckout)} disabled={isLimited}>
 *   {isLimited ? `Wait ${resetInSeconds}s…` : 'Place Order'}
 * </button>
 */
export function useRateLimit(options: RateLimitOptions): RateLimitState & {
  guarded: <T extends (...args: any[]) => any>(
    fn: T
  ) => (...args: Parameters<T>) => ReturnType<T> | undefined;
} {
  const { maxCalls, windowMs, onLimitReached } = options;
  const timestamps = useRef<number[]>([]);

  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remaining: maxCalls,
    resetInSeconds: 0,
  });

  // Prune timestamps that are outside the current sliding window
  const prune = useCallback(() => {
    const now = Date.now();
    timestamps.current = timestamps.current.filter((ts) => now - ts < windowMs);
  }, [windowMs]);

  const guarded = useCallback(
    <T extends (...args: any[]) => any>(fn: T) =>
      (...args: Parameters<T>): ReturnType<T> | undefined => {
        prune();
        const now = Date.now();

        if (timestamps.current.length >= maxCalls) {
          // Still rate-limited — compute remaining cooldown
          const oldest = timestamps.current[0];
          const resetMs = windowMs - (now - oldest);
          const resetSec = Math.ceil(resetMs / 1000);

          setState({ isLimited: true, remaining: 0, resetInSeconds: resetSec });
          onLimitReached?.(resetSec);

          console.warn(
            `[RateLimit] Blocked: ${timestamps.current.length}/${maxCalls} calls ` +
              `in ${windowMs / 1000}s window. Resets in ${resetSec}s.`
          );
          return undefined;
        }

        timestamps.current.push(now);
        const newRemaining = maxCalls - timestamps.current.length;
        setState({ isLimited: false, remaining: newRemaining, resetInSeconds: 0 });

        return fn(...args) as ReturnType<T>;
      },
    [maxCalls, windowMs, onLimitReached, prune]
  );

  // Auto-clear the limited state once the cooldown expires
  useEffect(() => {
    if (!state.isLimited) return;

    const timer = setTimeout(() => {
      prune();
      const stillLimited = timestamps.current.length >= maxCalls;
      setState({
        isLimited: stillLimited,
        remaining: maxCalls - timestamps.current.length,
        resetInSeconds: 0,
      });
    }, state.resetInSeconds * 1000 + 150); // +150ms buffer

    return () => clearTimeout(timer);
  }, [state.isLimited, state.resetInSeconds, maxCalls, prune]);

  return { ...state, guarded };
}

// ─── Debounce Hook ────────────────────────────────────────────────────────────

/**
 * useDebounce — delays propagating a value until `delay` ms after the last change.
 *
 * Ideal for search inputs: prevents a product filter or API query from firing
 * on every keystroke, reducing CPU load and preventing search-based API flooding.
 *
 * @example
 * const debouncedQuery = useDebounce(rawQuery, 300);
 * useEffect(() => { filterProducts(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
