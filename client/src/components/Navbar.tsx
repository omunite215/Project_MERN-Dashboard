import { useState } from "react";
import {
  AppBar,
  useTheme,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
} from "@mui/material";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
  GitHub,
} from "@mui/icons-material";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "@/api/types";
import { useThemeStore } from "@/store/useThemeStore";
import { navItems } from "@/config/navItems";
import FlexBetween from "@/components/FlexBetween";
import profileImage from "@/assets/profile.jpeg";

interface NavbarProps {
  user: Partial<User>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [query, setQuery] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Quick navigation: jump to the first page whose name matches the query.
  const runSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = navItems.find((item) => item.path && item.text.toLowerCase().includes(q));
    if (match?.path) {
      navigate({ to: `/${match.path}` as never });
      setQuery("");
    }
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side */}
        <FlexBetween>
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
          >
            <MenuIcon />
          </IconButton>
          <FlexBetween
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "9px",
              gap: "3rem",
              p: "0.1rem 1.5rem",
            }}
            title="Search — jump to a page"
          >
            <InputBase
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
            />
            <IconButton onClick={runSearch} title="Go">
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* Right Side */}
        <FlexBetween sx={{ gap: "1.5rem" }}>
          <IconButton
            onClick={() =>
              window.open(
                "https://github.com/omunite215/MERN-Dashboard",
                "_blank"
              )
            }
            title="Source Code"
          >
            <GitHub sx={{ fontSize: "25px" }} />
          </IconButton>

          <IconButton onClick={() => toggleMode()} title="Dark Mode">
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          <IconButton title="Setting">
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
              title={user.name}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                sx={{ height: "32px", width: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  sx={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px",
                }}
              />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleClose} title="Log Out">
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
