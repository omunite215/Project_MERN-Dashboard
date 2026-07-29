import { Box } from "@mui/material";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import DataTable from "@/components/DataTable";
import { userColumns } from "@/config/userColumns";
import { useAdmins } from "@/api/queries";

export default function AdminScene() {
  const { data, isLoading } = useAdmins();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
      <DataTable
        rows={data ?? []}
        columns={userColumns}
        loading={isLoading || !data}
        getRowId={(row) => row._id}
        height="75vh"
        mt="40px"
        slots={{ columnMenu: CustomColumnMenu }}
      />
    </Box>
  );
}
