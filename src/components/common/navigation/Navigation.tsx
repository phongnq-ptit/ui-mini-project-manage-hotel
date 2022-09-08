import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import HotelIcon from "@mui/icons-material/Hotel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

const Navigation = () => {
  const { userInfo, setUserInfo, setIsLogged, setIsAdmin } =
    useContext(UserContext);

  // Handle event logout
  const onHandleLogout = () => {
    localStorage.clear();

    setUserInfo(null);
    setIsLogged(false);
    setIsAdmin(false);
  };

  return (
    <Box sx={{ width: 315 }} role="presentation">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        mt={3}
      >
        <Box>
          <Avatar
            sx={{
              backgroundColor: "#009688",
              fontWeight: 500,
              textTransform: "uppercase",
              width: 150,
              height: 150,
              fontSize: 70,
              marginBottom: 2,
            }}
          >
            {userInfo.name[0]}
          </Avatar>
          <Typography gutterBottom align="center">
            {userInfo.name}
          </Typography>
          <Typography gutterBottom align="center">
            {userInfo.email}
          </Typography>
          <Typography gutterBottom align="center">
            {userInfo.role.toUpperCase()}
          </Typography>
        </Box>
      </Grid>
      <List>
        <Link
          to="/admin/manage_users"
          style={{ textDecoration: "none", color: "#282828" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <Typography fontWeight={900} p={1}>
                Manage Users
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to="/admin/manage_rooms"
          style={{ textDecoration: "none", color: "#282828" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HotelIcon />
              </ListItemIcon>
              <Typography fontWeight={900} p={1}>
                Manage Rooms
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to="/admin/manage_bookings"
          style={{ textDecoration: "none", color: "#282828" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ReceiptLongIcon />
              </ListItemIcon>
              <Typography fontWeight={900} p={1}>
                Manage Bookings
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to="/admin/manage_events"
          style={{ textDecoration: "none", color: "#282828" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <Typography fontWeight={900} p={1}>
                Manage Events
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onHandleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <Typography fontWeight={900} p={1}>
              Logout
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Navigation;
