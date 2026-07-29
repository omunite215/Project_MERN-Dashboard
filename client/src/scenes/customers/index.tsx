import { Box } from "@mui/material";
import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import { userColumns } from "@/config/userColumns";
import { useCustomers } from "@/api/queries";

export default function Customers() {
  const { data, isLoading } = useCustomers();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <DataTable
        rows={data ?? []}
        columns={userColumns}
        loading={isLoading || !data}
        getRowId={(row) => row._id}
        height="75vh"
        mt="40px"
      />
    </Box>
  );
}
