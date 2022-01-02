import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  distinctUntilChanged,
  filter,
  first,
  fromEvent,
  map,
  startWith,
  switchMap,
  tap,
  throttleTime,
  timer
} from "rxjs";
import { combineLatest } from "rxjs/internal/observable/combineLatest";

const EasingFunctions = {
  // no easing, no acceleration
  linear: (t: number) => t,
  // accelerating from zero velocity
  easeInQuad: (t: number) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t: number) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t: number) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t: number) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t: number) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t: number) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};

export const CursorShadow: FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef || !active) {
      return () => false;
    }
    const sub = timer(500, 0)
      .pipe(
        first(),
        () =>
          combineLatest([
            fromEvent<MouseEvent>(window, "mousemove").pipe(first()),
            fromEvent<MouseEvent>(window, "mousemove")
          ]),
        throttleTime(75),
        map(([initial, now]: [MouseEvent, MouseEvent]) => ({
          x:
            (Math.min(1, Math.max(-1, (now.pageX - initial.pageX) / 64)) + 1) /
            2,
          y:
            (Math.min(1, Math.max(-1, (now.pageY - initial.pageY) / 64)) + 1) /
            2
        })),
        map(({ x, y }) => ({
          x: x * (2 - x),
          y: y * (2 - y)
        })),
        distinctUntilChanged((a, b) => a.x === b.x && a.y === b.y)
      )
      .subscribe((pos) => active && setMousePos(pos));
    return () => sub.unsubscribe();
  }, [active, wrapperRef]);
  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => {
        setMousePos({ x: 1, y: 1 });
        setActive(true);
      }}
      onMouseLeave={() => {
        setMousePos({ x: 0, y: 0 });
        setActive(false);
      }}
      className="relative z-10"
    >
      <div
        className={`bg-pink absolute w-full h-full transition duration-75 pointer-events-none z-0`}
        style={{
          transform: `translate3D(${mousePos.x}rem, ${mousePos.y}rem, 0)`
        }}
      />
      <div className="bg-black relative">{children}</div>
    </div>
  );
};
