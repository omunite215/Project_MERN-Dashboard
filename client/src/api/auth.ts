import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "./http";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";

interface AuthResponse { accessToken: string; user: AuthUser }

export const fetchMe = () => apiFetch<AuthUser>("auth/me");

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      apiFetch<AuthResponse>("auth/login", { method: "POST", body: JSON.stringify(creds) }),
    onSuccess: (data) => setAuth(data),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      apiFetch<AuthResponse>("auth/register", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (data) => setAuth(data),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: () => apiFetch<void>("auth/logout", { method: "POST" }),
    onSettled: () => clearAuth(),
  });
}
