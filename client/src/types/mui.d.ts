import "@mui/material/styles";

// The dashboard theme (see src/theme/theme.ts) builds palette colors from
// numeric design tokens (e.g. theme.palette.primary[600],
// theme.palette.secondary[200]) and adds a custom `neutral` color plus
// `background.alt`. Augment MUI's palette types so components can read them
// with full type-safety.
declare module "@mui/material/styles" {
  interface PaletteColor {
    [shade: number]: string;
  }
  interface SimplePaletteColorOptions {
    [shade: number]: string;
  }

  interface Palette {
    neutral: PaletteColor;
  }
  interface PaletteOptions {
    neutral?: Partial<PaletteColor>;
  }

  interface TypeBackground {
    alt: string;
  }
}
