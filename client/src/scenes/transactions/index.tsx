import { useState } from "react";
import { type GridColDef, type GridSortModel, type GridPaginationModel } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import DataGridCustomToolbar from "@/components/DataGridCustomToolbar";
import DataTable from "@/components/DataTable";
import AsyncState from "@/components/AsyncState";
import { useTransactions } from "@/api/queries";
import type { Transaction } from "@/api/types";

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

export default function Transactions() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<object>({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useTransactions({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

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
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(txData) => (
          <DataTable
            rows={txData.transactions}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row._id}
            height="80vh"
            server={{
              paginationMode: "server",
              sortingMode: "server",
              rowCount: txData.total,
              paginationModel: { page, pageSize },
              onPaginationModelChange: handlePaginationModelChange,
              onSortModelChange: handleSortModelChange,
              pageSizeOptions: [20, 50, 100],
            }}
            slots={{ toolbar: DataGridCustomToolbar }}
            slotProps={{
              toolbar: { searchInput, setSearchInput, setSearch },
            }}
          />
        )}
      </AsyncState>
    </Box>
  );
}
