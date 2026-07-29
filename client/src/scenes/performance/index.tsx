import { Box, Typography, useTheme } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import DataTable from "@/components/DataTable";
import AsyncState from "@/components/AsyncState";
import { useUserPerformance } from "@/api/queries";
import { useAuthStore } from "@/store/useAuthStore";
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

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Performance() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.user?._id ?? "");
  const { data, isLoading, error } = useUserPerformance(userId);

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header
        title="PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance here"
      />
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(perf) => {
          const count = perf.sales.length;
          const revenue = perf.sales.reduce(
            (sum, t) => sum + Number(t.cost || 0),
            0
          );
          const aov = count ? revenue / count : 0;
          const cards = [
            { label: "Affiliate Sales", value: count.toLocaleString() },
            { label: "Total Revenue", value: currency(revenue) },
            { label: "Avg Order Value", value: currency(aov) },
          ];

          return (
            <>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", mt: "1rem" }}>
                {cards.map((c) => (
                  <Box
                    key={c.label}
                    sx={{
                      flex: "1 1 12rem",
                      p: "1.25rem 1.5rem",
                      backgroundColor: theme.palette.background.alt,
                      borderRadius: "0.55rem",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      {c.label}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "600", color: theme.palette.secondary[200] }}
                    >
                      {c.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <DataTable
                rows={perf.sales}
                columns={columns}
                loading={false}
                getRowId={(row) => row._id}
                height="65vh"
                mt="1.5rem"
                slots={{ columnMenu: CustomColumnMenu }}
              />
            </>
          );
        }}
      </AsyncState>
    </Box>
  );
}
