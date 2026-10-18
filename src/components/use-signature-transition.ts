"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { signature } from "@/data/signature";

gsap.registerPlugin(ScrollTrigger, useGSAP);
type Finish = (after?: () => void) => void;

/** One visual element, measured in its final navigation slot; only transforms
 * change during travel. Scroll stays native. Route clicks share one finish tween.
 */
export function useSignatureTransition(header: RefObject<HTMLElement | null>, wordmark: RefObject<HTMLAnchorElement | null>, pathname: string) {
  const finishRef = useRef<Finish | null>(null);
  const previousRoute = useRef<string | null>(null);

  useGSAP(() => {
    const shell = header.current;
    const mark = wordmark.current;
    if (!shell || !mark) return;
    const returningHome = previousRoute.current !== null && previousRoute.current !== "/" && pathname === "/";
    previousRoute.current = pathname;
    let disposed = false;
    let pending: (() => void) | undefined;
    let docking: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;
    let reverse: gsap.core.Tween | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let resizeFrame = 0;
    let intentDocked = false;
    const media = gsap.matchMedia();

    // Safe early activation if a visitor acts before fonts/images settle.
    finishRef.current = (after) => {
      shell.dataset.signatureReady = "true";
      gsap.set(mark, { clearProps:"transform" });
      gsap.set(shell, { "--signature-nav-opacity":1, "--signature-header-opacity":1 });
      shell.dataset.signatureDocked = "true";
      shell.dataset.signatureScrolled = "true";
      intentDocked = true;
      after?.();
    };

    const setup = () => {
      if (disposed) return;
      media.add({ reduced:"(prefers-reduced-motion: reduce)", full:"(prefers-reduced-motion: no-preference)" }, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const home = pathname === "/";
        const hero = document.getElementById("signature-hero");
        const state = { progress:home && hero && !intentDocked ? 0 : 1 };
        let originX=0, originY=0, originScale=1;

        function measure() {
          // Reset the transform for the destination measurement, then restore
          // the current progress in the same frame; no intermediate layout paints.
          shell!.dataset.signatureReady = "true";
          gsap.set(mark, { x:0, y:0, scale:1, transformOrigin:"top left" });
          const compact = mark!.getBoundingClientRect();
          const viewportWidth = document.documentElement.clientWidth;
          const introWidth = Math.min(viewportWidth * signature.introViewportWidth, signature.introMaxWidth);
          const introHeight = introWidth * signature.artwork.height / signature.artwork.width;
          originX = (viewportWidth - introWidth) / 2 - compact.left;
          originY = (window.innerHeight - introHeight) / 2 - compact.top;
          originScale = introWidth / compact.width;
        }

        function render() {
          const p = Math.max(0,Math.min(1,state.progress));
          const t = reduced ? (p > 0.01 ? 1 : 0) : p;
          const inverse = 1-t;
          // Cubic trajectory bends gently upward before arriving in the nav.
          const x = inverse**3 * originX + 3*inverse**2*t*(originX*.35) + 3*inverse*t*t*(originX*.06);
          const y = inverse**3 * originY + 3*inverse**2*t*(originY*.78) + 3*inverse*t*t*(originY*.12);
          gsap.set(mark, { x, y, scale:Math.exp(Math.log(originScale)*(1-t)), force3D:true });
          const navOpacity = Math.max(0,Math.min(1,(t-.56)/.30));
          gsap.set(shell, { "--signature-nav-opacity":navOpacity, "--signature-header-opacity":Math.min(1,t*1.4) });
          shell!.dataset.signatureDocked = navOpacity > .05 ? "true" : "false";
          // The colour cycle holds only while the hero rests at full screen; the
          // first scroll hands the wordmark to the chrome layer.
          shell!.dataset.signatureScrolled = t > .04 ? "true" : "false";
        }

        measure();
        if (home && hero) {
          trigger = ScrollTrigger.create({
            trigger:hero, start:"top top", end:() => `+=${Math.min(560,window.innerHeight*.65)}`,
            invalidateOnRefresh:true,
            onUpdate(self) {
              if (docking?.isActive()) return;
              if (reverse?.isActive()) reverse.kill();
              if (intentDocked) {
                state.progress=1;
                if (self.progress >= 1) intentDocked=false;
              } else state.progress=self.progress;
              render();
            },
            onRefresh(self) { measure(); if (!docking?.isActive() && !reverse?.isActive()) state.progress=intentDocked ? 1 : self.progress; render(); },
          });
          state.progress = intentDocked ? 1 : trigger.progress;
          render();
          if (returningHome && trigger.progress < .01 && !intentDocked && !reduced) {
            state.progress=1; render();
            reverse=gsap.to(state,{progress:0,duration:.6,ease:"power2.inOut",onUpdate:render});
          }
        } else { state.progress=1; render(); }

        finishRef.current = (after) => {
          if (after) pending=after; // A rapid second click replaces the pending destination.
          intentDocked=true;
          reverse?.kill();
          if (docking?.isActive()) return;
          const complete = () => {
            state.progress=1; render();
            const destination=pending; pending=undefined;
            destination?.();
          };
          if (state.progress >= .999 || reduced || !home) complete();
          else docking=gsap.to(state,{progress:1,duration:signature.navigationDuration*(1-state.progress),ease:"power2.inOut",onUpdate:render,onComplete:complete});
        };

        function resize() {
          cancelAnimationFrame(resizeFrame);
          resizeFrame=requestAnimationFrame(() => {
            if (disposed) return;
            measure();
            if (trigger) trigger.refresh();
            else render();
          });
        }
        // Observe the actual compact slot as well as the viewport (including
        // desktop/mobile breakpoint changes and browser text/font changes).
        resizeObserver=new ResizeObserver(resize);
        resizeObserver.observe(mark!);
        window.addEventListener("resize",resize);
        return () => {
          docking?.kill(); reverse?.kill(); trigger?.kill();
          resizeObserver?.disconnect(); cancelAnimationFrame(resizeFrame);
          window.removeEventListener("resize",resize);
        };
      });
    };

    Promise.all([document.fonts.ready, mark.querySelector("img")?.decode().catch(() => undefined)]).then(setup);
    return () => {
      disposed=true;
      media.revert();
      finishRef.current=null;
      gsap.set(mark,{clearProps:"transform,transformOrigin"});
      shell.style.removeProperty("--signature-nav-opacity");
      shell.style.removeProperty("--signature-header-opacity");
      // The global header persists between routes. Keep the measured compact
      // fallback while the next route's setup awaits assets, avoiding a flash
      // of the oversized homepage state on secondary pages or a home return.
      shell.dataset.signatureReady="true";
      delete shell.dataset.signatureDocked;
      delete shell.dataset.signatureScrolled;
    };
  }, { dependencies:[pathname], scope:header, revertOnUpdate:true });

  return (after?: () => void) => {
    if (finishRef.current) finishRef.current(after);
    else after?.();
  };
}
