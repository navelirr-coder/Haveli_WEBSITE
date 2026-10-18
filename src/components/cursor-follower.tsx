"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/assets";

const MARK = asset("studio-chilli-lemon");

/**
 * The chilli-and-lemon mark drifts behind the pointer. It fades in slowly on
 * the first movement, lags a little so it trails the cursor instead of
 * snapping to it, and stands down entirely for touch and reduced-motion
 * visitors.
 */
export function CursorFollower() {
  const sprite = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const node = sprite.current;
    if (!node || !fine.matches || still.matches) return;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let awake = false;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!awake) {
        awake = true;
        node.dataset.awake = "true";
      }
    };
    const onLeave = () => {
      awake = false;
      node.dataset.awake = "false";
    };
    const draw = () => {
      x += (targetX - x) * 0.055;
      y += (targetY - y) * 0.055;
      const lean = Math.max(-8, Math.min(8, (targetX - x) * 0.035));
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -52%) rotate(${lean.toFixed(2)}deg)`;
      frame = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <Image ref={sprite} className="cursor-follower" src={MARK.publicPath} alt="" aria-hidden="true" width={MARK.width} height={MARK.height} loading="eager" draggable={false} />;
}
