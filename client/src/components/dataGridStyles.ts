import type { Theme } from "@mui/material";
import type { SxProps } from "@mui/material";

export const dataGridSx = (theme: Theme): SxProps<Theme> => ({
  "& .MuiDataGrid-root": { border: "none" },
  "& .MuiDataGrid-cell": { borderBottom: "none" },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.background.alt,
    color: theme.palette.secondary[100],
    borderBottom: "none",
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: theme.palette.primary.light,
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary[100],
    borderTop: "none",
  },
  "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
    color: `${theme.palette.secondary[200]} !important`,
  },
});
