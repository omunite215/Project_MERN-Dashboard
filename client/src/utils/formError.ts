/** Coerce a TanStack Form v1 field error value to a display string. */
export function toMsg(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof (e as { message?: unknown }).message === "string")
    return (e as { message: string }).message;
  return String(e);
}
