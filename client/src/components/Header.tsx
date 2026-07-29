import { Typography, Box, useTheme } from "@mui/material";

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[100], fontWeight: "bold", mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: theme.palette.secondary[300] }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
