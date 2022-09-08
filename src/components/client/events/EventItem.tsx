import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { IEventProps } from "../../../interfaces/event.interface";
import { Link } from "react-router-dom";

const EventItem = ({ event }: IEventProps) => {
  return (
    <Card sx={{ width: 500, marginBottom: 3 }}>
      <CardMedia
        component="img"
        height="140"
        image={"http://127.0.0.1:5500/" + event.banner}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ textTransform: "capitalize" }}
        >
          <Link
            to={`/events/${event.id}`}
            style={{ color: "green", textDecoration: "none" }}
          >
            {event.title}
          </Link>
        </Typography>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "25rem",
          }}
        >
          <Typography paragraph={true} noWrap>
            {event.description}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <AccessAlarmIcon />
        <Typography sx={{ fontSize: "0.8rem" }}>
          {new Date(event.startDate).toLocaleDateString("vi-VN")} -
          {new Date(event.endDate).toLocaleDateString("vi-VN")}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default EventItem;
