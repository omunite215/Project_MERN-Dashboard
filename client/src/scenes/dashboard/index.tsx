import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import FlexBetween from "@/components/FlexBetween";
import BreakdownChart from "@/components/BreakdownChart";
import OverviewChart from "@/components/OverviewChart";
import StatBox from "@/components/StatBox";
import DataTable from "@/components/DataTable";
import { useDashboard } from "@/api/queries";
import type { Transaction } from "@/api/types";
import AsyncState from "@/components/AsyncState";
import { useStaggerIn } from "@/hooks/useStaggerIn";

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

export default function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading, error } = useDashboard();
  const gridRef = useStaggerIn(".stat-in");

  if (error) {
    return (
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </FlexBetween>
        <AsyncState isLoading={false} error={error} data={undefined}>
          {() => null}
        </AsyncState>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        ref={gridRef}
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          className="stat-in"
          title="Total Customers"
          value={data?.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          className="stat-in"
          title="Sales Today"
          value={data?.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          className="stat-in"
          sx={{
            gridColumn: "span 8",
            gridRow: "span 2",
            backgroundColor: theme.palette.background.alt,
            p: "1rem",
            borderRadius: "0.55rem",
          }}
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          className="stat-in"
          title="Monthly Sales"
          value={data?.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          className="stat-in"
          title="Yearly Sales"
          value={data?.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <DataTable
          className="stat-in"
          rows={data?.transactions ?? []}
          columns={columns}
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          sxOverride={{
            gridColumn: "span 8",
            gridRow: "span 3",
            "& .MuiDataGrid-root": { border: "none", borderRadius: "5rem" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        />

        <Box
          className="stat-in"
          sx={{
            gridColumn: "span 4",
            gridRow: "span 3",
            backgroundColor: theme.palette.background.alt,
            p: "1.5rem",
            borderRadius: "0.55rem",
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales by Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
