import { Box, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import FlexBetween from "@/components/FlexBetween";

interface StatBoxProps {
  title: string;
  value: number | string | undefined;
  increase: string;
  icon: ReactNode;
  description: string;
  className?: string;
}

const StatBox = ({ title, value, increase, icon, description, className }: StatBoxProps) => {
  const theme = useTheme();
  return (
    <Box
      className={className}
      sx={{
        gridColumn: "span 2",
        gridRow: "span 1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "1.25rem 1rem",
        flex: "1 1 100%",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      <FlexBetween gap="1rem">
        {/* Original used theme.palette.light (undefined at runtime) → inherited
            text color. Preserve that exact appearance by not overriding color. */}
        <Typography variant="h5" fontStyle="italic">
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
