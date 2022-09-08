import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IBooking } from "../../../interfaces/booking.interface";
import { IRoom } from "../../../interfaces/room.interface";
import { BookingContext } from "../../../context/BookingContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RoomContext } from "../../../context/RoomContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditBooking = () => {
  const { listBooking, reload, setReload } = useContext(BookingContext);

  const { listRoom, startDate, endDate, setStartDate, setEndDate } =
    useContext(RoomContext);

  const [roomsSave, setRoomsSave] = useState<string[]>([]);

  const [oldRooms, setOldRooms] = useState<number[]>([]);

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [bookingUpdate, setBookingUpdate] = useState<IBooking>({} as IBooking);

  const [totalPrice, setTotalPrice] = useState<string>("0");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const params = useParams();

  // get information of booking by id
  useEffect(() => {
    if (params.id) {
      const getBookingUpdate = async () => {
        await axios
          .get(`http://localhost:8080/api/bookings/${params.id}`)
          .then((response) => {
            setBookingUpdate(response.data);
            setTotalPrice(
              response.data.bookedRoom
                .reduce((total: number, room: IRoom) => {
                  return total + room.price;
                }, 0)
                .toLocaleString("en-us") + " VND"
            );

            setOldRooms(
              response.data.bookedRoom.map((item: IRoom) => {
                return item.id;
              })
            );
          })
          .catch((error) => {
            setSuccessful("");
            setErr(error.response.data.msg);
          });
      };

      getBookingUpdate();
    }
  }, [params.id, listBooking]);

  const navigate = useNavigate();

  const onChangeStartDate = (date: Date | null) => {
    const name = "startDate";

    setBookingUpdate({
      ...bookingUpdate,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });

    setIsEditing(true);

    setStartDate(
      date === null
        ? new Date().toJSON()
        : new Date(date).toISOString().slice(0, 10)
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    const name = "endDate";

    setBookingUpdate({
      ...bookingUpdate,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });

    setIsEditing(true);

    setEndDate(
      date === null
        ? new Date().toJSON()
        : new Date(date).toISOString().slice(0, 10)
    );
  };

  const handleChangeSelect = (event: SelectChangeEvent<typeof roomsSave>) => {
    const {
      target: { value },
    } = event;
    setRoomsSave(typeof value === "string" ? value.split(",") : value);
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setBookingUpdate({
      ...bookingUpdate,
      [name]: value,
    });
  };

  const handleUpdateBooking = async () => {
    await axios
      .patch(`http://localhost:8080/api/bookings/${bookingUpdate.id}`, {
        startDate: startDate.substring(0, 10) + "T00:00:00",
        endDate: endDate.substring(0, 10) + "T00:00:00",
        note: bookingUpdate.note,
        status: bookingUpdate.status,
      })
      .then((response) => {
        setSuccessful(response.data.msg);
        setErr("");
        setReload(!reload);
        setRoomsSave([]);

        setTimeout(() => {
          setSuccessful("");
        }, 3000);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });

    roomsSave.map(async (item: string) => {
      await axios.post(`http://localhost:8080/api/booked_rooms`, {
        bookingId: bookingUpdate.id,
        roomId: Number(item),
      });
    });

    oldRooms.map(async (item: number) => {
      await axios.delete(
        `http://localhost:8080/api/booked_rooms?bookingId=${bookingUpdate.id}&roomId=${item}`
      );
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
        rowSpacing={4}
      >
        <Grid item xs={1}>
          <Avatar
            sizes="100"
            sx={{
              backgroundColor: "lightblue",
              fontWeight: 500,
              textTransform: "uppercase",
              width: 50,
              height: 50,
              fontSize: "35px",
              ml: 3,
            }}
          >
            {bookingUpdate?.client?.name[0]}
          </Avatar>
        </Grid>
        <Grid item xs={5}>
          <Typography fontSize={22}>{bookingUpdate.client?.name}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"Email: " + bookingUpdate.client?.email}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>
            {"Phone Number: " + bookingUpdate.client?.phone}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22} sx={{ display: "inline" }}>
            {"Status: "}
          </Typography>
          <Chip
            label={bookingUpdate.status}
            color={
              bookingUpdate.status === "request"
                ? "secondary"
                : bookingUpdate.status === "confirmed"
                ? "primary"
                : bookingUpdate.status === "completed"
                ? "success"
                : "warning"
            }
          />
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={22}>{"Total Price: " + totalPrice}</Typography>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Start Date"
              inputFormat="dd/MM/yyyy"
              value={bookingUpdate.startDate?.substring(0, 10)}
              onChange={onChangeStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="End Date"
              inputFormat="dd/MM/yyyy"
              value={bookingUpdate.endDate?.substring(0, 10)}
              onChange={onChangeEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Box px={4}>
        <Alert severity="warning">
          Please select a date in advance to search for available rooms!
        </Alert>
      </Box>
      <Box px={3} mt={4}>
        <FormControl
          sx={{ m: 1, width: 300 }}
          disabled={isEditing ? false : true}
        >
          <InputLabel id="demo-multiple-checkbox-label">Room</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={roomsSave}
            onChange={handleChangeSelect}
            input={<OutlinedInput label="Room" />}
            renderValue={(selected) => {
              return listRoom
                .filter((room) => selected.includes(room.id as any))
                .map((record) => record.roomNumber)
                .join(", ");
            }}
            MenuProps={MenuProps}
          >
            {listRoom.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                <Checkbox checked={roomsSave.indexOf(room.id as any) > -1} />
                <ListItemText primary={room.roomNumber} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box px={3} mt={4}>
        <Typography gutterBottom>Note:</Typography>
        <TextareaAutosize
          disabled={isEditing ? false : true}
          aria-label="empty textarea"
          placeholder="Note"
          style={{ width: 675, height: 100 }}
          value={bookingUpdate.note}
          name="note"
          onChange={onChangeTextArea}
        />
      </Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        mt={6}
      >
        <Grid item xs={3}>
          <Button variant="contained" onClick={() => handleUpdateBooking()}>
            Update Booking
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditBooking;
