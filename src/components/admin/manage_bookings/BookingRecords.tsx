import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IBookingProps } from "../../../interfaces/booking.interface";
import { IRoom } from "../../../interfaces/room.interface";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { BookingContext } from "../../../context/BookingContext";

const BookingRecords = ({ booking, no }: IBookingProps) => {
  const { reload, setReload } = useContext(BookingContext);

  // Action to open menu when clicking on Avatar
  const [anchorElBooking, setAnchorElBooking] =
    React.useState<null | HTMLElement>(null);

  const handleOpenBookingMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElBooking(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElBooking(null);
  };

  const handleChangeStatusBooking = async (_status: string) => {
    await axios
      .patch(`http://localhost:8080/api/bookings/${booking.id!}`, {
        ...booking,
        status: _status,
      })
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {});
  };

  const requestMenu = (bookingId: number) => {
    return (
      <>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElBooking}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElBooking)}
          onClose={handleCloseUserMenu}
        >
          <Link
            to={`/admin/manage_bookings/detail/${bookingId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button>Detail Booking</Button>
            </MenuItem>
          </Link>
          <Link
            to={`/admin/manage_bookings/edit/${bookingId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button>Edit Booking</Button>
            </MenuItem>
          </Link>
          <MenuItem onClick={handleCloseUserMenu}>
            <Button
              sx={{ color: "darkgreen" }}
              onClick={() => handleChangeStatusBooking("confirmed")}
            >
              Accept Booking
            </Button>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Button
              sx={{ color: "crimson" }}
              onClick={() => handleChangeStatusBooking("canceled")}
            >
              Cancel Booking
            </Button>
          </MenuItem>
        </Menu>
      </>
    );
  };

  const confirmedMenu = (bookingId: number) => {
    return (
      <>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElBooking}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElBooking)}
          onClose={handleCloseUserMenu}
        >
          <Link
            to={`/admin/manage_bookings/detail/${bookingId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button>Detail Booking</Button>
            </MenuItem>
          </Link>
          <Link
            to={`/admin/manage_bookings/edit/${bookingId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button>Edit Booking</Button>
            </MenuItem>
          </Link>
          <MenuItem onClick={handleCloseUserMenu}>
            <Button
              color="success"
              onClick={() => handleChangeStatusBooking("completed")}
            >
              Finish Booking
            </Button>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Button
              sx={{ color: "crimson" }}
              onClick={() => handleChangeStatusBooking("canceled")}
            >
              Cancel Booking
            </Button>
          </MenuItem>
        </Menu>
      </>
    );
  };

  const completedAndCanceledMenu = (bookingId: number) => {
    return (
      <>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElBooking}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElBooking)}
          onClose={handleCloseUserMenu}
        >
          <Link
            to={`/admin/manage_bookings/detail/${bookingId}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Button>Detail Booking</Button>
            </MenuItem>
          </Link>
        </Menu>
      </>
    );
  };

  const menuStatus = (status: string, bookingId: number) => {
    switch (status) {
      case "request":
        return requestMenu(bookingId);
      case "confirmed":
        return confirmedMenu(bookingId);
      case "completed":
        return completedAndCanceledMenu(bookingId);
      case "canceled":
        return completedAndCanceledMenu(bookingId);
    }
  };

  return (
    <Grid
      key={booking.id}
      container
      sx={{ border: "1px solid #1a237e", borderRadius: 5, padding: 2 }}
      mt={2}
      alignItems="center"
    >
      <Grid item xs={1}>
        <Typography>{no + 1 + "."}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>{booking.client.name}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Chip
          label={new Date(booking.startDate).toLocaleDateString("vi-VN")}
          color="info"
        />
      </Grid>
      <Grid item xs={2}>
        <Chip
          label={new Date(booking.endDate).toLocaleDateString("vi-VN")}
          color="info"
        />
      </Grid>
      <Grid item xs={2}>
        {booking.bookedRoom
          .reduce((total: number, room: IRoom) => {
            return total + room.price;
          }, 0)
          .toLocaleString("en-us") + " VND"}
      </Grid>
      <Grid item xs={2}>
        <Typography>
          <Chip
            label={booking.status}
            color={
              booking.status === "request"
                ? "secondary"
                : booking.status === "confirmed"
                ? "primary"
                : booking.status === "completed"
                ? "success"
                : "warning"
            }
          />
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open menu">
            <IconButton onClick={handleOpenBookingMenu} sx={{ p: 0 }}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          {menuStatus(booking.status, booking.id!)}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingRecords;
