import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import DataTable from "@/components/DataTable";
import AsyncState from "@/components/AsyncState";
import { useUserPerformance } from "@/api/queries";
import { USER_ID } from "@/config/constants";
import type { Transaction } from "@/api/types";

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

export default function Performance() {
  const { data, isLoading, error } = useUserPerformance(USER_ID);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance here"
      />
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(perf) => (
          <DataTable
            rows={perf.sales}
            columns={columns}
            loading={false}
            getRowId={(row) => row._id}
            height="75vh"
            mt="40px"
            slots={{ columnMenu: CustomColumnMenu }}
          />
        )}
      </AsyncState>
    </Box>
  );
}
