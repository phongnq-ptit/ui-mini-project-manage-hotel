import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IBooking } from "../../../interfaces/booking.interface";
import { IRoom } from "../../../interfaces/room.interface";
import { BookingContext } from "../../../context/BookingContext";

const DetailBooking = () => {
  const { listBooking, reload, setReload } = useContext(BookingContext);

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [bookingDetail, setBookingDetail] = useState<IBooking>({} as IBooking);

  const [totalPrice, setTotalPrice] = useState<string>("0");

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const getBookingDetail = async () => {
        await axios
          .get(`http://localhost:8080/api/bookings/${params.id}`)
          .then((response) => {
            setBookingDetail(response.data);
            setTotalPrice(
              response.data.bookedRoom
                .reduce((total: number, room: IRoom) => {
                  return total + room.price;
                }, 0)
                .toLocaleString("en-us") + " VND"
            );
          })
          .catch((error) => {
            setSuccessful("");
            setErr(error.response.data.msg);
          });
      };

      getBookingDetail();
    }
  }, [params.id, listBooking]);

  const navigate = useNavigate();

  const handleChangeStatusBooking = async (_status: string) => {
    await axios
      .patch(`http://localhost:8080/api/bookings/${bookingDetail.id!}`, {
        ...bookingDetail,
        status: _status,
      })
      .then((response) => {
        setSuccessful(response.data.msg);
        setErr("");
        setReload(!reload);

        setTimeout(() => {
          setSuccessful("");
        }, 2000);
      })
      .catch((error) => {
        setSuccessful("");
        setErr(error.response.data.msg);
      });
  };

  return (
    <>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <Box>
        {err && <Alert severity="error">{err}</Alert>}
        {successful && <Alert severity="success">{successful}</Alert>}
      </Box>
      <Grid
        container
        p={5}
        justifyContent="center"
        alignItems="center"
        rowSpacing={2}
      >
        <Grid item xs={1}>
          <Avatar
            sizes="100"
            sx={{
              backgroundColor: "lightblue",
              fontWeight: 500,
              textTransform: "uppercase",
              width: 45,
              height: 45,
              ml: 3,
            }}
          >
            {bookingDetail?.client?.name[0]}
          </Avatar>
        </Grid>
        <Grid item xs={5}>
          <Typography fontSize={22}>{bookingDetail.client?.name}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"Email: " + bookingDetail.client?.email}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"Start Date: " +
              new Date(bookingDetail.startDate).toLocaleDateString("vi-VN")}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"Phone Number: " + bookingDetail.client?.phone}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"End Date: " +
              new Date(bookingDetail.endDate).toLocaleDateString("vi-VN")}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>{"Total Price: " + totalPrice}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={22} sx={{ display: "inline" }}>
            {"Status: "}
          </Typography>
          <Chip
            label={bookingDetail.status}
            color={
              bookingDetail.status === "request"
                ? "secondary"
                : bookingDetail.status === "confirmed"
                ? "primary"
                : bookingDetail.status === "completed"
                ? "success"
                : "warning"
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={22} sx={{ display: "inline" }}>
            Booked Room:
          </Typography>
          {bookingDetail.bookedRoom?.map((room: IRoom) => {
            return (
              <Tooltip
                key={room.id}
                title={"Price: " + room.price.toLocaleString("en-us") + " VND"}
              >
                <Typography
                  fontSize={22}
                  ml={2}
                  sx={{
                    display: "inline",
                    border: "1px solid #282828",
                    py: 1,
                    px: 3,
                    borderRadius: 5,
                  }}
                >
                  {room.roomNumber}
                </Typography>
              </Tooltip>
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={22}>Note:</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={22}>{bookingDetail.note}</Typography>
        </Grid>
      </Grid>
      {(bookingDetail.status === "request" ||
        bookingDetail.status === "confirmed") && (
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                bookingDetail.status === "request"
                  ? handleChangeStatusBooking("confirmed")
                  : handleChangeStatusBooking("completed");
              }}
            >
              {bookingDetail.status === "request"
                ? "Confirm Booking"
                : "Finish Booking"}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleChangeStatusBooking("canceled")}
            >
              Cancel Booking
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Link
              to={`/admin/manage_bookings/edit/${bookingDetail.id}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained">Edit Booking</Button>
            </Link>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default DetailBooking;
