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
  Divider,
  Autocomplete,
} from "@mui/material";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/api/auth";
import { navItems } from "@/config/navItems";
import FlexBetween from "@/components/FlexBetween";
import profileImage from "@/assets/profile.jpeg";

// Only navigable pages are searchable (section headers have path: null).
const pageOptions = navItems.filter((item) => item.path);

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const [settingsEl, setSettingsEl] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(settingsEl);
  const [query, setQuery] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Navigate to the picked page suggestion and reset the search box.
  const goToPage = (path: string | null) => {
    if (!path) return;
    navigate({ to: `/${path}` as never });
    setQuery("");
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
          <Autocomplete
            options={pageOptions}
            getOptionLabel={(option) => option.text}
            isOptionEqualToValue={(option, value) => option.path === value.path}
            value={null}
            onChange={(_, selected) => goToPage(selected?.path ?? null)}
            inputValue={query}
            onInputChange={(_, value) => setQuery(value)}
            autoHighlight
            blurOnSelect
            clearOnBlur
            handleHomeEndKeys
            noOptionsText="No matching page"
            sx={{ width: "18rem" }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  component="li"
                  key={key}
                  {...optionProps}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {option.icon}
                  {option.text}
                </Box>
              );
            }}
            renderInput={(params) => (
              <Box
                ref={params.slotProps.input.ref}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: "9px",
                  gap: "1rem",
                  p: "0.1rem 1.5rem",
                }}
                title="Search — jump to a page"
              >
                <InputBase
                  placeholder="Search pages..."
                  inputProps={params.slotProps.htmlInput}
                  sx={{ flex: 1 }}
                />
                <Search />
              </Box>
            )}
          />
        </FlexBetween>

        {/* Right Side */}
        <FlexBetween sx={{ gap: "1.5rem" }}>
          <IconButton
            onClick={(e) => setSettingsEl(e.currentTarget)}
            title="Settings"
          >
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <Menu
            anchorEl={settingsEl}
            open={settingsOpen}
            onClose={() => setSettingsEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Box sx={{ px: 2, py: 1, maxWidth: 260 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
              >
                {user?.name ?? "Account"}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ display: "block", color: theme.palette.secondary[300] }}
              >
                {user?.email ?? "—"}
              </Typography>
              {user?.role && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-block",
                    mt: 0.5,
                    px: 1,
                    borderRadius: "4px",
                    textTransform: "capitalize",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.secondary[200],
                  }}
                >
                  {user.role}
                </Typography>
              )}
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                toggleMode();
                setSettingsEl(null);
              }}
            >
              {theme.palette.mode === "dark" ? (
                <LightModeOutlined sx={{ mr: 1.5, fontSize: "20px" }} />
              ) : (
                <DarkModeOutlined sx={{ mr: 1.5, fontSize: "20px" }} />
              )}
              {theme.palette.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            </MenuItem>
          </Menu>

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
              title={user?.name}
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
                  {user?.name}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: theme.palette.secondary[200] }}
                >
                  {user?.occupation}
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
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout.mutate(undefined, { onSettled: () => navigate({ to: "/login" }) });
                }}
                title="Log Out"
              >
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
