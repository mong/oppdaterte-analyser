"use client";

import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { colors } from "@mui/material";
import React from "react";

type AdminBarProps = {
  email: string;
  userName: string;
};

const settings = [
  { tekst: "Forsiden", url: "/" },
  { tekst: "Last opp analyse", url: "/last-opp/" },
  { tekst: "Se HTTP-Headers", url: "/headers/" },
  { tekst: "Logg ut", url: "/.auth/logout" },
];

export default function AdminBar({ email, userName }: AdminBarProps) {
  const [anchorElem, setAnchorElem] = React.useState<null | HTMLElement>(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ margin: 0 }}>
        <Container maxWidth="xl" disableGutters={false} sx={{ padding: 0 }}>
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <Avatar sx={{ bgcolor: colors.green["A200"], marginRight: 1 }}>
                <VerifiedUserIcon sx={{ color: "#000" }} />
              </Avatar>
              <Typography variant="h6" color="inherit" component="div">
                {userName} / {email}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 0 }}></Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={(e) => setAnchorElem(e.currentTarget)}
                  sx={{ p: 0, mr: 2 }}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElem}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElem)}
                onClose={(e) => setAnchorElem(null)}
              >
                {settings.map((setting) => (
                  <MenuItem
                    onClick={(e) => setAnchorElem(null)}
                    component={Link}
                    href={setting.url}
                    key={setting.tekst}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.tekst}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
