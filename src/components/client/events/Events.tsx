import { Container, Grid } from "@mui/material";
import React, { useContext } from "react";
import { EventContext } from "../../../context/EventContext";
import EventItem from "./EventItem";

const Events = () => {
  const { listEvent } = useContext(EventContext);

  return (
    <Container>
      <Grid container my={5}>
        {listEvent.map((eventItem) => {
          return (
            <Grid item mx={1} key={eventItem.id}>
              <EventItem event={eventItem} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Events;
