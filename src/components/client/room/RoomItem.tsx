import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { IRoomProps } from "../../../interfaces/room.interface";

const RoomItem = ({ room }: IRoomProps) => {
  return (
    <Card sx={{ width: 360 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={"http://127.0.0.1:5500/" + room.roomImages?.[0].url}
          alt="green iguana"
        />
        <CardContent>
          <Grid container>
            <Grid item xs>
              <Link
                to={`/rooms/${room.id}`}
                style={{ textDecoration: "none", color: "green" }}
              >
                <Typography gutterBottom variant="h5" component="div">
                  Room {room.roomNumber}
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Chip
                label={"type: " + room.roomType}
                size="small"
                color="info"
                sx={{ marginRight: 1 }}
              />
              <Chip label={"floor: " + room.floor} size="small" color="info" />
            </Grid>
          </Grid>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "25rem",
            }}
          >
            <Typography
              paragraph={true}
              noWrap
              variant="body2"
              color="text.secondary"
            >
              {room.description}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container p={1}>
          <Grid item xs>
            <Chip
              size="medium"
              label={"Price: " + room.price.toLocaleString("en-us") + " VND"}
              color="warning"
            />
          </Grid>
          <Grid item>
            <Link to="/booking" style={{ textDecoration: "none" }}>
              <Button variant="contained" size="small" color="primary">
                Book Now
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default RoomItem;
