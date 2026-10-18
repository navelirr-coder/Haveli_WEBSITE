"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { motion, MotionConfig } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/data/site";
import { signature } from "@/data/signature";
import { useSignatureTransition } from "./use-signature-transition";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const header = useRef<HTMLElement>(null);
  const wordmark = useRef<HTMLAnchorElement>(null);
  const clickedDestination = useRef<string | null>(null);
  const finishIntro = useSignatureTransition(header,wordmark,pathname);
  useLayoutEffect(() => {
    if (clickedDestination.current === pathname) {
      clickedDestination.current = null;
      window.scrollTo({top:0,behavior:"instant"});
    }
  }, [pathname]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  function closeMenu() {
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.focus();
  }
  function followLink(event: MouseEvent<HTMLAnchorElement>, href: string, mobile = false) {
    if (mobile) closeMenu();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href !== pathname) clickedDestination.current = href;
    if (pathname !== "/") return;
    event.preventDefault();
    finishIntro(() => {
      if (href === "/") window.scrollTo({top:0,behavior:"instant"});
      else router.push(href,{scroll:false});
    });
  }
  return <MotionConfig reducedMotion="user">
    <header ref={header} className="site-header signature-header" data-signature-home={pathname === "/" ? "true" : "false"} onFocusCapture={() => { if(pathname === "/") finishIntro(); }}>
      <Link ref={wordmark} href="/" scroll={false} className="signature-wordmark" style={{ aspectRatio: `${signature.artwork.width} / ${signature.artwork.height}` }} aria-label="Studio Haveli home" onClick={(event) => followLink(event,"/")}>
        {pathname === "/" && <>
          <Image className="wordmark-layer wordmark-pink" src={signature.layers.pink.publicPath} alt="" width={signature.layers.pink.width} height={signature.layers.pink.height} priority sizes="(max-width:700px) 84vw, 1360px" />
          <Image className="wordmark-layer wordmark-red" src={signature.layers.red.publicPath} alt="" width={signature.layers.red.width} height={signature.layers.red.height} loading="eager" sizes="(max-width:700px) 84vw, 1360px" />
          <Image className="wordmark-layer wordmark-green" src={signature.layers.green.publicPath} alt="" width={signature.layers.green.width} height={signature.layers.green.height} loading="eager" sizes="(max-width:700px) 84vw, 1360px" />
        </>}
        <Image className="wordmark-layer wordmark-chrome" src={signature.layers.chrome.publicPath} alt="" width={signature.layers.chrome.width} height={signature.layers.chrome.height} loading="eager" sizes="(max-width:700px) 84vw, 1360px" />
      </Link>
      <nav aria-label="Primary navigation" className="desktop-nav signature-nav">
        {navigation.map(({ href, label }) => <Link key={href} href={href} scroll={false} onClick={(event) => followLink(event,href)} aria-current={isActive(href) ? "page" : undefined} className={href === "/contact" ? "nav-contact" : ""}>{label}{href === "/contact" && <ArrowUpRight size={15} aria-hidden="true" />}</Link>)}
      </nav>
      <motion.button ref={trigger} type="button" className="menu-trigger signature-nav" aria-label="Open navigation menu" aria-haspopup="dialog" whileTap={{ scale: .94 }} onClick={() => finishIntro(() => { dialog.current?.showModal(); document.body.style.overflow = "hidden"; })}><Menu size={25} /></motion.button>
    </header>
    <dialog ref={dialog} className="menu-dialog" aria-label="Navigation menu" onCancel={closeMenu} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className="menu-top"><span className="eyebrow">Come as you are.</span><button type="button" className="icon-button" aria-label="Close navigation menu" onClick={closeMenu} autoFocus><X /></button></div>
      <nav aria-label="Mobile navigation">{navigation.map(({ href, label }, index) => <motion.div key={href} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}><Link href={href} scroll={false} aria-current={isActive(href) ? "page" : undefined} onClick={(event) => followLink(event,href,true)}>{label}<ArrowUpRight aria-hidden="true" /></Link></motion.div>)}</nav>
      <p>Clear thinking. A voice of your own.</p>
    </dialog>
    <noscript><style>{`.signature-header[data-signature-home="true"]{position:absolute}.signature-header[data-signature-home="true"] .signature-wordmark{position:absolute}.signature-header .desktop-nav{display:flex!important;opacity:1!important;pointer-events:auto!important;flex-wrap:wrap;max-width:65%;gap:8px 16px;font-size:11px;margin-left:auto}.signature-header .menu-trigger{display:none!important}`}</style></noscript>
  </MotionConfig>;
}
