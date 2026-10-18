"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AnimationStage({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const heroLines = root.current?.querySelectorAll(".hero-line");
      const heroArt = root.current?.querySelector(".hero-art");
      if (heroLines?.length) gsap.from(heroLines, { yPercent: 105, opacity: 0, duration: 1, stagger: .12, ease: "power3.out", clearProps: "all" });
      if (heroArt) gsap.from(heroArt, { y: 50, rotation: -8, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "all" });
      gsap.utils.toArray<HTMLElement>(root.current?.querySelectorAll("[data-reveal]") ?? []).forEach((element) => {
        gsap.from(element, { y: 34, opacity: 0, duration: .75, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: element, start: "top 93%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(root.current?.querySelectorAll("[data-image-reveal]") ?? []).forEach((element) => {
        gsap.from(element, { clipPath: "inset(0 0 12% 0)", duration: 1.1, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: element, start: "top 92%", once: true } });
      });
      const art = root.current?.querySelector(".hero-art-scroll");
      if (art) gsap.to(art, { y: -60, rotation: 5, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: 1 } });
    });
    media.add({ desktop:"(min-width:701px) and (prefers-reduced-motion:no-preference)", mobile:"(max-width:700px) and (prefers-reduced-motion:no-preference)" }, (context) => {
      const distance = context.conditions?.desktop ? 22 : 10;
      gsap.utils.toArray<HTMLElement>(root.current?.querySelectorAll("[data-packaging-parallax]") ?? []).forEach((element, index) => {
        const offset = distance * (index % 2 === 0 ? 1 : -1);
        // Full artwork travels inside reserved space; reveal transforms use
        // the outer panel so the two animations do not compete.
        gsap.fromTo(element, { y:offset }, { y:-offset, ease:"none", scrollTrigger:{trigger:element.closest(".packaging-art"),start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true} });
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });
  return <div ref={root}>{children}</div>;
}
