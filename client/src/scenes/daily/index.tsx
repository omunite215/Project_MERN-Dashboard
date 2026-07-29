import { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import DatePicker from "react-datepicker";
import Header from "@/components/Header";
import LineChartCard from "@/components/LineChartCard";
import { useDateRange } from "@/hooks/useDateRange";
import { useSales } from "@/api/queries";
import "react-datepicker/dist/react-datepicker.css";

export default function Daily() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange(
    new Date("2021-02-01"),
    new Date("2021-03-01")
  );
  const { data } = useSales();
  const theme = useTheme();

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { dailyData } = data;

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

    Object.values(dailyData).forEach(({ date, totalSales, totalUnits }) => {
      const dateFormatted = new Date(date);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = date.substring(date.indexOf("-") + 1);
        totalSalesLine.data = [...totalSalesLine.data, { x: splitDate, y: totalSales }];
        totalUnitsLine.data = [...totalUnitsLine.data, { x: splitDate, y: totalUnits }];
      }
    });

    return [[totalSalesLine, totalUnitsLine]];
  }, [data, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />
      {data ? (
        <Box height="75vh">
          <Box display="flex" justifyContent="flex-end">
            <Box>
              <DatePicker
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />
            </Box>
            <Box>
              <DatePicker
                selected={endDate}
                onChange={(date) => date && setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </Box>
          </Box>
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
