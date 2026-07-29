import { useState } from "react";
import { DataGrid, type GridColDef, type GridSortModel, type GridPaginationModel } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import Header from "@/components/Header";
import DataGridCustomToolbar from "@/components/DataGridCustomToolbar";
import { useTransactions } from "@/api/queries";
import type { Transaction } from "@/api/types";

export default function Transactions() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<object>({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useTransactions({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns: GridColDef<Transaction>[] = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 0.5 },
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

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSort(newSortModel[0] ?? {});
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
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
          rows={data?.transactions ?? []}
          columns={columns}
          rowCount={data?.total ?? 0}
          paginationMode="server"
          sortingMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[20, 50, 100]}
          onSortModelChange={handleSortModelChange}
          slots={{ toolbar: DataGridCustomToolbar }}
          slotProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
}
