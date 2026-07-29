import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Layout() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const outletRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = outletRef.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el, { opacity: 0, duration: 0.3, ease: "power2.out" });
    },
    { dependencies: [pathname] }
  );

  return (
    <Box sx={{ display: isNonMobile ? "flex" : "block", width: "100%", height: "100%" }}>
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Box ref={outletRef}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
