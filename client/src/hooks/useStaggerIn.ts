import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function useStaggerIn(selector: string) {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(selector, {
        opacity: 0,
        y: 16,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      });
    },
    { scope }
  );
  return scope;
}
