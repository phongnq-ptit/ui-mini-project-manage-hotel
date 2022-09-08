import { Container, Grid } from "@mui/material";
import React, { useContext } from "react";
import { RoomContext } from "../../../context/RoomContext";
import RoomItem from "./RoomItem";

const Rooms = () => {
  const { listRoom } = useContext(RoomContext);

  return (
    <Container>
      <Grid container my={5}>
        {listRoom.map((roomItem) => {
          return (
            <Grid item mx={1} key={roomItem.id} mb={2}>
              <RoomItem room={roomItem} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Rooms;
