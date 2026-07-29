import { Box, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
  type GridPaginationModel,
  type GridSlotsComponent,
  type GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import { dataGridSx } from "./dataGridStyles";

export interface ServerPaginationProps {
  paginationMode: "server";
  sortingMode: "server";
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  pageSizeOptions: number[];
}

interface DataTableProps<T extends object> {
  rows: T[];
  columns: GridColDef<T>[];
  loading: boolean;
  getRowId?: (row: T) => string;
  /** Box height, e.g. "75vh" or "80vh". Only applied when sxOverride is not set. */
  height?: string;
  /** Override the default sx (dataGridSx) if the scene needs a different style. */
  sxOverride?: SxProps<Theme>;
  /** Pass mt prop to the Box wrapper */
  mt?: string | number;
  server?: ServerPaginationProps;
  slots?: Partial<GridSlotsComponent>;
  slotProps?: GridSlotsComponentsProps;
  className?: string;
}

export default function DataTable<T extends object>({
  rows,
  columns,
  loading,
  getRowId,
  height,
  sxOverride,
  mt,
  server,
  slots,
  slotProps,
  className,
}: DataTableProps<T>) {
  const theme = useTheme();

  return (
    <Box className={className} height={sxOverride ? height : (height ?? "75vh")} mt={mt} sx={sxOverride ?? dataGridSx(theme)}>
      <DataGrid
        loading={loading}
        getRowId={getRowId}
        rows={rows}
        columns={columns}
        {...(server
          ? {
              paginationMode: server.paginationMode,
              sortingMode: server.sortingMode,
              rowCount: server.rowCount,
              paginationModel: server.paginationModel,
              onPaginationModelChange: server.onPaginationModelChange,
              onSortModelChange: server.onSortModelChange,
              pageSizeOptions: server.pageSizeOptions,
            }
          : {})}
        {...(slots ? { slots } : {})}
        {...(slotProps ? { slotProps } : {})}
      />
    </Box>
  );
}
