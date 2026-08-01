type Cell = string | number | null | undefined;

/**
 * Build a CSV from headers + rows and trigger a browser download.
 * Dependency-free: uses a Blob + object URL and a synthetic anchor click.
 */
export function downloadCsv(filename: string, headers: string[], rows: Cell[][]): void {
  const escape = (value: Cell): string => {
    const s = value == null ? "" : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
