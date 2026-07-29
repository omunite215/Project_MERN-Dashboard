import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface CollapsibleProps {
  open: boolean;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function Collapsible({ open, children, sx }: CollapsibleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }
      gsap.to(el, {
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [open] }
  );

  return (
    <Box ref={ref} sx={{ overflow: "hidden", height: 0, opacity: 0, ...sx }}>
      {children}
    </Box>
  );
}
