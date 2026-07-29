import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useStaggerIn } from "@/hooks/useStaggerIn";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
} from "@mui/icons-material";
import type { Dispatch, SetStateAction } from "react";
import type { User } from "@/api/types";
import { navItems } from "@/config/navItems";
import FlexBetween from "@/components/FlexBetween";
import profileImage from "@/assets/profile.jpeg";

interface SidebarProps {
  user: Partial<User>;
  isNonMobile: boolean;
  drawerWidth: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({
  user,
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const listRef = useStaggerIn(".MuiListItem-root");

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
            "& .MuiDrawer-paper::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ m: "1.5rem 2rem 2rem 3rem" }}>
              <FlexBetween sx={{ color: theme.palette.secondary.main }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => {
                      void navigate({ to: "/dashboard" as "/" });
                      setActive("dashboard");
                    }}
                    title="ECOMVISION"
                  >
                    ECOMVISION
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title="Close Sidebar"
                  >
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            <Box ref={listRef}>
              <List>
                {navItems.map(({ text, icon, path }) => {
                  if (!icon) {
                    return (
                      <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                        {text}
                      </Typography>
                    );
                  }

                  return (
                    <ListItem key={text} title={text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          void navigate({ to: `/${path}` as "/" });
                          setActive(path!);
                        }}
                        sx={{
                          backgroundColor:
                            active === path
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === path
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === path
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === path && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>

          <Box sx={{ pb: "1rem" }}>
            <Divider />
            <FlexBetween sx={{ textTransform: "none", gap: "1rem", m: "1.5rem 2rem 0 3rem" }}>
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                sx={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  sx={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
