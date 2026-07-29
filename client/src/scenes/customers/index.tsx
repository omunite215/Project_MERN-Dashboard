import { Box } from "@mui/material";
import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import AsyncState from "@/components/AsyncState";
import { userColumns } from "@/config/userColumns";
import { useCustomers } from "@/api/queries";

export default function Customers() {
  const { data, isLoading, error } = useCustomers();

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(customers) => (
          <DataTable
            rows={customers}
            columns={userColumns}
            loading={false}
            getRowId={(row) => row._id}
            height="75vh"
            mt="40px"
          />
        )}
      </AsyncState>
    </Box>
  );
}
