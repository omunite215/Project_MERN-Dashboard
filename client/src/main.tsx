import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "@/app/queryClient";
import { router } from "@/router";
import { useThemeStore } from "@/store/useThemeStore";
import { themeSettings } from "@/theme/theme";
import { refreshAccessToken } from "@/api/authClient";
import { fetchMe } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import "@/styles/index.css";

function Root() {
  const mode = useThemeStore((s) => s.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

async function bootstrap() {
  const token = await refreshAccessToken();
  if (token) {
    try {
      const user = await fetchMe();
      useAuthStore.getState().setAuth({ accessToken: token, user });
    } catch {
      useAuthStore.getState().clearAuth();
    }
  }
}

bootstrap().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  );
});
