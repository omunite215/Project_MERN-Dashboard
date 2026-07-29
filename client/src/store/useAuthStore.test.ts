import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./useAuthStore";

beforeEach(() => useAuthStore.getState().clearAuth());

describe("useAuthStore", () => {
  it("sets and clears auth", () => {
    useAuthStore.getState().setAuth({ accessToken: "t", user: { _id: "1", name: "A", email: "a@x.co", role: "admin" } });
    expect(useAuthStore.getState().accessToken).toBe("t");
    expect(useAuthStore.getState().user?.role).toBe("admin");
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
