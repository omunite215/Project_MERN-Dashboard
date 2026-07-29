import { Box } from "@mui/material";
import Header from "@/components/Header";
import CustomColumnMenu from "@/components/DataGridCustomColumnMenu";
import DataTable from "@/components/DataTable";
import AsyncState from "@/components/AsyncState";
import { userColumns } from "@/config/userColumns";
import { useAdmins } from "@/api/queries";

export default function AdminScene() {
  const { data, isLoading, error } = useAdmins();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(admins) => (
          <DataTable
            rows={admins}
            columns={userColumns}
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
