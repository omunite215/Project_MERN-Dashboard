import { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "@/components/Header";
import LineChartCard from "@/components/LineChartCard";
import { useSales } from "@/api/queries";

export default function Monthly() {
  const { data } = useSales();
  const theme = useTheme();

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;

    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [] as { x: string; y: number }[],
    };

    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [] as { x: string; y: number }[],
    };

    Object.values(monthlyData).forEach(({ month, totalSales, totalUnits }) => {
      totalSalesLine.data = [...totalSalesLine.data, { x: month, y: totalSales }];
      totalUnitsLine.data = [...totalUnitsLine.data, { x: month, y: totalUnits }];
    });

    return [[totalSalesLine, totalUnitsLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      {data ? (
        <Box height="75vh">
          <LineChartCard data={formattedData ?? []} />
        </Box>
      ) : (
        <Typography variant="h5" mt="20%" textAlign="center">
          Loading...
        </Typography>
      )}
    </Box>
  );
}
