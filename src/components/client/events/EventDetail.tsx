import { Box, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IEvent } from "../../../interfaces/event.interface";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

const EventDetail = () => {
  const params = useParams();

  const [eventDetail, setEventDetail] = useState<IEvent>({} as IEvent);

  // Get info event by params.id
  useEffect(() => {
    if (params.id) {
      const getEventDetail = async () => {
        await axios
          .get(`http://localhost:8080/api/events/${params.id}`)
          .then((response) => {
            setEventDetail(response.data);
          })
          .catch((error) => {
            alert(error.response.data.msg);
          });
      };

      getEventDetail();
    }
  }, [params.id]);

  return (
    <Container sx={{ my: 5 }}>
      <Box
        component="img"
        sx={{
          maxHeight: 600,
          width: "100%",
          borderRadius: 5,
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
        alt=""
        src={
          eventDetail.banner === undefined
            ? ""
            : "http://127.0.0.1:5500/" + eventDetail.banner
        }
      />
      <Typography
        textAlign="center"
        variant="h4"
        textTransform="capitalize"
        my={2}
        fontWeight="bold"
        color="green"
      >
        {eventDetail?.title}
      </Typography>
      <Grid container direction="row" alignItems="center" mb={2}>
        <Grid item color="darkgreen">
          <AccessAlarmIcon />
        </Grid>
        <Grid item color="green">
          Start Date:{" "}
          {new Date(eventDetail?.startDate).toLocaleDateString("vi-VN")}
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item color="darkgreen">
          <AccessAlarmIcon />
        </Grid>
        <Grid item color="green">
          End Date: {new Date(eventDetail?.endDate).toLocaleDateString("vi-VN")}
        </Grid>
      </Grid>
      <Box my={2} p={4}>
        <Typography>{eventDetail.description}</Typography>
      </Box>
    </Container>
  );
};

export default EventDetail;
