import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  distinctUntilChanged,
  first,
  fromEvent,
  map,
  throttleTime,
  timer
} from "rxjs";
import { combineLatest } from "rxjs/internal/observable/combineLatest";

export const CursorShadow: FC<{
  children: ReactNode;
  alwaysActive?: boolean;
}> = ({ children, alwaysActive = false }) => {
  const [active, setActive] = useState(alwaysActive);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef || !active) {
      return () => false;
    }
    const sub = timer(750, 0)
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
