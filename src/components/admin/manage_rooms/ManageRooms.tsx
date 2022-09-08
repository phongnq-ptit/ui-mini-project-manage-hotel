import { Alert, Box, Button, Chip, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { RoomContext } from "../../../context/RoomContext";
import { IManageRooms } from "../../../interfaces/room.interface";
import AddButton from "../../common/add_button/AddButton";
import ModalAddRoom from "./ModalAddRoom";
import ModalEditRoom from "./ModalEditRoom";

const ManageRooms = () => {
  const { listRoom, setRoomType, reload, setReload } = useContext(RoomContext);

  const [dataRoom, setDataRoom] = useState<IManageRooms>({
    onEdit: false,
  });

  const [onAddRoom, setOnAddRoom] = useState<boolean>(false);

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const handleDelete = async (roomId: number) => {
    if (window.confirm("Do you want this room??")) {
      await axios
        .delete(`http://localhost:8080/api/rooms/${roomId}`)
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
      <Box>
        <Typography sx={{ display: "inline", fontWeight: 500 }}>
          Change Room Type:{" "}
        </Typography>
        <Button onClick={() => setRoomType("none")}>All</Button>
        <Button onClick={() => setRoomType("single")}>Single</Button>
        <Button onClick={() => setRoomType("double")}>Double</Button>
        <Button onClick={() => setRoomType("triple")}>Triple</Button>
      </Box>
      <Box>
        {err && <Alert severity="error">{err}</Alert>}
        {successful && <Alert severity="success">{successful}</Alert>}
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
          <Typography>Room number</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Type</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Capacity</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Active</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Price</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Action</Typography>
        </Grid>
      </Grid>
      {listRoom?.map((room, index) => {
        if (room.roomNumber === 0) return "";
        return (
          <Grid
            key={room.id}
            container
            sx={{ border: "1px solid #1a237e", borderRadius: 5, padding: 2 }}
            mt={2}
            alignItems="center"
          >
            <Grid item xs={1}>
              <Typography>{index + 1 + "."}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{room.roomNumber}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Chip
                label={room.roomType.toUpperCase()}
                color={
                  room.roomType === "triple"
                    ? "secondary"
                    : room.roomType === "single"
                    ? "primary"
                    : "warning"
                }
              />
            </Grid>
            <Grid item xs={1}>
              <Typography>{room.capacity}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Chip
                label={!room.active ? "unavailable" : "available"}
                color={!room.active ? "error" : "success"}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography>
                {room.price.toLocaleString("en-us") + " VND"}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ float: "right" }}>
              <Button
                variant="contained"
                onClick={() =>
                  setDataRoom({
                    roomId: room.id,
                    onEdit: true,
                  })
                }
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                sx={{ ml: 1 }}
                onClick={() => handleDelete(room.id!)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        );
      })}
      <ModalEditRoom dataRoom={dataRoom} setDataRoom={setDataRoom} />
      <ModalAddRoom onAddRoom={onAddRoom} setOnAddRoom={setOnAddRoom} />
      <AddButton on={onAddRoom} setOn={setOnAddRoom} />
    </>
  );
};

export default ManageRooms;
