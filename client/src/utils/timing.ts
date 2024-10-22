export type TimingFunction = (t: number) => number;

export const interpolateWithTiming = (
  from: number,
  to: number,
  timing: TimingFunction,
  time?: number,
): number | ((t: number) => number) => {
  const f = (t: number) => {
    // Ensure t is between 0 and 1
    t = Math.max(0, Math.min(1, t));
    // Apply timing function to t
    const interpolatedT = timing(t);
    // Interpolate between from and to using the interpolated t
    return from + (to - from) * interpolatedT;
  };
  if (time !== undefined) return f(time);
  else return f;
};

export const timingLinear: TimingFunction = (t) => t;
export const timingEaseIn: TimingFunction = (t) => t * t;
export const timingEaseOut: TimingFunction = (t) => 1 - Math.pow(1 - t, 2);
export const timingEaseInOut: TimingFunction = (t) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const cubicBezier = (
  p1: number,
  p2: number,
  p3: number,
  p4: number,
): TimingFunction => {
  return (t: number): number => {
    return (
      (1 - t) * 3 * p1 +
      3 * (1 - t) * 2 * t * p2 +
      3 * (1 - t) * t * 2 * p3 +
      t * 3 * p4
    );
  };
};

export const normalize = (min: number, max: number, value: number) =>
  value <= min ? 0 : value >= max ? 1 : (value - min) / (max - min);

export const animate = (
  from: number,
  to: number,
  startTime: number,
  currentTime: number,
  duration: number,
  delay: number,
  timingFunction: TimingFunction,
) => {
  const normalizedTime = normalize(
    startTime + delay,
    startTime + delay + duration,
    currentTime,
  );

  const newValue = interpolateWithTiming(
    from,
    to,
    timingFunction,
    normalizedTime,
  ) as number;

  return newValue;
};

export const animateWithRequestAnimationFrame = (
  from: number,
  to: number,
  duration: number,
  delay: number,
  timingFunction: TimingFunction,
  callback: (newValue: number) => void,
  assignRequestAnimationFrameId?: (requestAnimationFrameId: number) => void,
  onEnd?: () => void,
) => {
  let start: number;
  let requestAnimationFrameId: number = 0;

  const f = (timeStamp?: number) => {
    if (timeStamp === undefined) {
      requestAnimationFrameId = requestAnimationFrame(f);
      return;
    }

    if (start === undefined) {
      start = timeStamp;
    }
    const newValue = animate(
      from,
      to,
      start,
      timeStamp,
      duration,
      delay,
      timingFunction,
    );
    callback(newValue);

    if (timeStamp < start + delay + duration) {
      requestAnimationFrameId = requestAnimationFrame(f);
      assignRequestAnimationFrameId?.(requestAnimationFrameId);
    } else onEnd?.();
  };

  f();
};
