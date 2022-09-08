import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IRoom } from "../../../interfaces/room.interface";
import Carousel from "react-material-ui-carousel";
import { Container } from "@mui/system";
import { Box, Chip, Grid, Typography } from "@mui/material";
import "./rooms.css";

const RoomDetail = () => {
  const params = useParams();

  const [roomDetail, setRoomDetail] = useState<IRoom>({} as IRoom);

  // Get infor room by params.id
  useEffect(() => {
    if (params.id) {
      const getRoomDetail = async () => {
        await axios
          .get(`http://localhost:8080/api/rooms/${params.id}`)
          .then((response) => {
            setRoomDetail(response.data);
          })
          .catch((error) => {
            alert(error.response.data.msg);
          });
      };

      getRoomDetail();
    }
  }, [params.id]);

  return (
    <Container>
      <Grid container my={5}>
        <Grid item>
          <Carousel
            interval={4000}
            animation="slide"
            indicators={true}
            stopAutoPlayOnHover
            swipe
            className="room-detail-carousel"
          >
            {roomDetail.roomImages?.map((itemImg) => (
              <Box
                key={itemImg.id}
                component="img"
                alt=""
                src={"http://127.0.0.1:5500/" + itemImg.url}
                sx={{
                  objectFit: "cover",
                  height: "500px",
                  width: "700px",
                }}
              />
            ))}
          </Carousel>
        </Grid>
        <Grid
          item
          px={4}
          py={1}
          sx={{ color: "green", fontWeight: "bold", letterSpacing: 2 }}
        >
          <Typography variant="h5" gutterBottom>
            {"Room: " + roomDetail.roomNumber}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {"Floor: " + roomDetail.floor}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {"Type: " + roomDetail.roomType}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {"Capacity: " + roomDetail.capacity}
          </Typography>
          <Chip
            size="medium"
            label={
              "Price: " + roomDetail.price?.toLocaleString("en-us") + " VND"
            }
            color="warning"
          />
        </Grid>
      </Grid>
      <Box>{roomDetail.description}</Box>
    </Container>
  );
};

export default RoomDetail;
