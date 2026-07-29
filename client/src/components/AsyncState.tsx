import type { ReactNode } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AsyncStateProps<T> {
  isLoading: boolean;
  error: unknown;
  data: T | undefined;
  children: (data: T) => ReactNode;
}

function AsyncState<T>({
  isLoading,
  error,
  data,
  children,
}: AsyncStateProps<T>): ReactNode {
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <Typography variant="h5" color="error.main" sx={{ textAlign: "center" }}>
          Failed to load data.
        </Typography>
      </Box>
    );
  }

  if (isLoading || data === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children(data);
}

export default AsyncState;
