import { Alert, Box, Button, Chip, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { EventContext } from "../../../context/EventContext";
import { IEvent, IManageEvents } from "../../../interfaces/event.interface";
import AddButton from "../../common/add_button/AddButton";
import ModalAddEvent from "./ModalAddEvent";
import ModalEditEvent from "./ModalEditEvent";

const ManageEvents = () => {
  const { listEvent, reload, setReload } = useContext(EventContext);

  const [dataEvent, setDataEvent] = useState<IManageEvents>({
    onEdit: false,
  });

  const [onAddRoom, setOnAddRoom] = useState<boolean>(false);

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const handleDelete = async (event: IEvent) => {
    if (window.confirm("Do you want this event??")) {
      await axios
        .delete(`http://localhost:8080/api/upload/${event.banner}`)
        .then((response) => {
          setReload(!reload);
        })
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
          window.setTimeout(() => {
            setErr("");
          }, 2000);
        });

      await axios
        .delete(`http://localhost:8080/api/events/${event.id}`)
        .then((response) => {
          setSuccessful(response.data.msg);
          setErr("");
          setReload(!reload);
          window.setTimeout(() => {
            setSuccessful("");
          }, 2000);
        })
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
          window.setTimeout(() => {
            setErr("");
          }, 2000);
        });
    }
  };

  return (
    <>
      {err && <Alert severity="error">{err}</Alert>}
      {successful && <Alert severity="success">{successful}</Alert>}
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
          <Typography>Banner</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Title</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Start Date</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>End Date</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Action</Typography>
        </Grid>
      </Grid>
      {listEvent?.map((event, index) => {
        return (
          <Grid
            key={event.id}
            container
            sx={{ border: "1px solid #1a237e", borderRadius: 5, padding: 2 }}
            mt={2}
            alignItems="center"
          >
            <Grid item xs={1}>
              <Typography>{index + 1 + "."}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Box
                component="img"
                sx={{
                  maxHeight: 100,
                  width: 200,
                  borderRadius: 5,
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                alt=""
                src={
                  event.banner === undefined
                    ? ""
                    : "http://127.0.0.1:5500/" + event.banner
                }
              />
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {event.title}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Chip
                label={new Date(event.startDate).toLocaleDateString("vi-VN")}
                color="secondary"
              />
            </Grid>
            <Grid item xs={2}>
              <Chip
                label={new Date(event.endDate).toLocaleDateString("vi-VN")}
                color="secondary"
              />
            </Grid>
            <Grid item xs={2} sx={{ float: "right" }}>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() =>
                  setDataEvent({
                    eventId: event.id,
                    onEdit: true,
                  })
                }
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(event)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        );
      })}
      <ModalEditEvent dataEvent={dataEvent} setDataEvent={setDataEvent} />
      <ModalAddEvent onAddEvent={onAddRoom} setOnAddEvent={setOnAddRoom} />
      <AddButton on={onAddRoom} setOn={setOnAddRoom} />
    </>
  );
};

export default ManageEvents;
