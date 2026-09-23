/** Clamp and quantize a volume level. Steps start at min; max remains reachable
 * when the interval is not an exact number of steps. Invalid bounds use 0/100,
 * reversed bounds are sorted, and invalid steps use 1.
 * @example normalizeVolume(0.36, 0.05, 0.95, 0.1) // 0.35
 */
export function normalizeVolume(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const first = Number.isFinite(min) ? min : 0;
  const second = Number.isFinite(max) ? max : 100;
  const low = Math.min(first, second);
  const high = Math.max(first, second);
  const quantum = Number.isFinite(step) && step > 0 ? step : 1;
  if (!Number.isFinite(value) || value <= low) return low;
  if (value >= high) return high;
  const grid = Math.min(high, low + Math.round((value - low) / quantum) * quantum);
  const nearest = high - value < Math.abs(grid - value) ? high : grid;
  // The control is bounded to small decimal ranges; rounding avoids 0.30000000004.
  return Number(nearest.toFixed(8));
}

/** Advance a falling weight by elapsed milliseconds without FPS dependence.
 * @example decayVolumePosition(80, 20, 50, 0) // 79
 */
export function decayVolumePosition(
  position: number,
  rate: number,
  elapsedMs: number,
  min: number,
): number {
  const speed = Number.isFinite(rate) ? Math.max(0, rate) : 0;
  const seconds = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) / 1000 : 0;
  return Math.max(min, position - speed * seconds);
}
