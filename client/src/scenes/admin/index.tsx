import { Box, useTheme } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import { useAdmins } from "@/api/queries";
import type { Admin } from "@/api/types";

export default function AdminScene() {
  const theme = useTheme();
  const { data, isLoading } = useAdmins();

  const columns: GridColDef<Admin>[] = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) =>
        String(params.value ?? "").replace(/^(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
    },
    { field: "country", headerName: "Country", flex: 0.4 },
    { field: "occupation", headerName: "Occupation", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
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
          rows={data ?? []}
          columns={columns}
          slots={{ columnMenu: CustomColumnMenu }}
        />
      </Box>
    </Box>
  );
}
