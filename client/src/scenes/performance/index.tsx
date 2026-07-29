import { Box, useTheme } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import { useUserPerformance } from "@/api/queries";
import { USER_ID } from "@/config/constants";
import type { Transaction } from "@/api/types";

export default function Performance() {
  const theme = useTheme();
  const { data, isLoading } = useUserPerformance(USER_ID);

  const columns: GridColDef<Transaction>[] = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (params.value as string[]).length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance here"
      />
      <Box
        mt="40px"
        height="75vh"
        sx={{
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
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data?.sales ?? []}
          columns={columns}
          slots={{ columnMenu: CustomColumnMenu }}
        />
      </Box>
    </Box>
  );
}
