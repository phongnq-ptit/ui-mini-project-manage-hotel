import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

const pages = ["home", "booking", "rooms", "events"];

const Header = () => {
  // Use UserContext get state
  const { userInfo, setUserInfo, isLogged, setIsLogged, isAdmin, setIsAdmin } =
    useContext(UserContext);

  // Handle event logout
  const onHandleLogout = () => {
    localStorage.clear();

    setUserInfo(null);
    setIsLogged(false);
    setIsAdmin(false);
  };

  // Action to open menu when clicking on Avatar
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            to={isAdmin ? "/admin" : "/"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {isAdmin ? "ADMIN P.BOOKING" : "P.BOOKING"}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {!isAdmin &&
              pages.map((page) => (
                <Link
                  to={page === "home" ? "/" : `/${page}`}
                  style={{ textDecoration: "none" }}
                  key={page}
                >
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    {page.toUpperCase()}
                  </Button>
                </Link>
              ))}
          </Box>

          {isLogged ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      backgroundColor: "lightblue",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {userInfo.name[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {!isAdmin && (
                  <>
                    <Link
                      to="/account"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Account</Typography>
                      </MenuItem>
                    </Link>
                    <Link
                      to="/history_booking"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">
                          History Booking
                        </Typography>
                      </MenuItem>
                    </Link>
                  </>
                )}
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "black" }}
                  onClick={onHandleLogout}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontSize: "14px",
                }}
              >
                LOGIN/REGISTER
              </Button>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
