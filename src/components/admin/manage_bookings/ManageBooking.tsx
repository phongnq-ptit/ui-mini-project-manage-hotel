import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { BookingContext } from "../../../context/BookingContext";
import AddButton from "../../common/add_button/AddButton";
import BookingRecords from "./BookingRecords";
import ModalAddBooking from "./ModalAddBooking";

const ManageBooking = () => {
  const { listBooking, setStatus } = useContext(BookingContext);

  const [onAddBooking, setOnAddBooking] = useState<boolean>(false);

  return (
    <>
      <Box>
        <Typography sx={{ display: "inline", fontWeight: 500 }}>
          Change Status:{" "}
        </Typography>
        <Button onClick={() => setStatus("none")}>All</Button>
        <Button onClick={() => setStatus("request")}>Request</Button>
        <Button onClick={() => setStatus("confirmed")}>Confirmed</Button>
        <Button onClick={() => setStatus("completed")}>Completed</Button>
        <Button onClick={() => setStatus("canceled")}>Canceled</Button>
      </Box>
      <Grid
        container
        sx={{
          borderRadius: 5,
          padding: 2,
          color: "darkblue",
          fontWeight: 900,
        }}
        alignItems="center"
        mt={2}
      >
        <Grid item xs={1}>
          <Typography>No</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Client name</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Start Date</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>End Date</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Total Price</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Status</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Action</Typography>
        </Grid>
      </Grid>
      {listBooking?.map((booking, index) => {
        return <BookingRecords booking={booking} no={index} key={booking.id} />;
      })}
      <ModalAddBooking
        onAddBooking={onAddBooking}
        setOnAddBooking={setOnAddBooking}
      />
      <AddButton on={onAddBooking} setOn={setOnAddBooking} />
    </>
  );
};

export default ManageBooking;
