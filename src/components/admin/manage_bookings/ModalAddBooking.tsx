import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BookingContext } from "../../../context/BookingContext";
import { RoomContext } from "../../../context/RoomContext";
import { IBooking } from "../../../interfaces/booking.interface";
import { IUser, IUserInputRegister } from "../../../interfaces/user.interface";

interface IModalAddBooking {
  onAddBooking: boolean;
  setOnAddBooking: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  height: 570,
  overflow: "scroll",
};

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

const ModalAddBooking = ({
  onAddBooking,
  setOnAddBooking,
}: IModalAddBooking) => {
  const [newUser, setNewUser] = useState<IUserInputRegister>({
    email: "",
    password: "123456",
    name: "",
    address: "",
    phone: "",
    comfirmPassword: "123456",
  });

  const [newBooking, setNewBooking] = useState<IBooking>({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    note: "",
    status: "",
    client: {} as IUser,
    bookedRoom: [],
  });

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [roomsSave, setRoomsSave] = useState<string[]>([]);

  const { listRoom, startDate, setStartDate, endDate, setEndDate } =
    useContext(RoomContext);

  const { reload, setReload } = useContext(BookingContext);

  const handleClose = async () => {
    setOnAddBooking(false);
    setNewUser({
      email: "",
      password: "123456",
      name: "",
      address: "",
      phone: "",
      comfirmPassword: "123456",
    });
    setNewBooking({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      note: "",
      status: "",
      client: {} as IUser,
      bookedRoom: [],
    });
    setErr("");
    setSuccessful("");
    setRoomsSave([]);
  };

  const onChangeStartDate = (date: Date | null) => {
    const name = "startDate";

    setNewBooking({
      ...newBooking,
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

    setNewBooking({
      ...newBooking,
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

    setNewBooking({
      ...newBooking,
      [name]: value,
    });
  };

  const onChangeUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleAddNewBooking = async () => {
    let cid: number = 0;

    // create new user
    await axios
      .post("http://localhost:8080/api/users/register", { ...newUser })
      .then((response) => {
        // setClientId(response.data.id);
        cid = response.data.id;
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });

    // create new booking
    await axios
      .post("http://localhost:8080/api/bookings", {
        startDate: startDate.substring(0, 10) + "T00:00:00",
        endDate: endDate.substring(0, 10) + "T00:00:00",
        note: newBooking.note,
        clientId: cid,
      })
      .then((response) => {
        roomsSave.map(async (item: string) => {
          await axios.post(`http://localhost:8080/api/booked_rooms`, {
            bookingId: response.data.id,
            roomId: Number(item),
          });
        });

        setOnAddBooking(false);
        setNewUser({
          email: "",
          password: "123456",
          name: "",
          address: "",
          phone: "",
          comfirmPassword: "123456",
        });
        setNewBooking({
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date().toISOString().slice(0, 10),
          note: "",
          status: "",
          client: {} as IUser,
          bookedRoom: [],
        });
        setReload(!reload);
        setRoomsSave([]);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  return (
    <div>
      <Modal
        open={onAddBooking}
        onClose={() => setOnAddBooking(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backgroundColor: "rgba(192,192,192,0.3)" }}
      >
        <Box sx={style}>
          <Grid container>
            <Grid item xs>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                gutterBottom
              >
                Add The Booking Profile
              </Typography>
            </Grid>
            <Grid item>
              <Button onClick={handleClose} variant="contained">
                <CloseIcon />
              </Button>
            </Grid>
          </Grid>
          <Divider />
          {err && <Alert severity="error">{err}</Alert>}
          {successful && <Alert severity="success">{successful}</Alert>}
          <Grid container px={5} pt={5} rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6}>
              <TextField
                value={newUser.name}
                type="text"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={onChangeUserInput}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={newUser.phone}
                type="number"
                name="phone"
                required
                fullWidth
                id="phone"
                label="Phone"
                autoFocus
                onChange={onChangeUserInput}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={newUser.email}
                type="email"
                name="email"
                required
                fullWidth
                id="email"
                label="Email"
                autoFocus
                onChange={onChangeUserInput}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={newUser.address}
                type="text"
                name="address"
                required
                fullWidth
                id="address"
                label="Address"
                autoFocus
                onChange={onChangeUserInput}
              />
            </Grid>
          </Grid>
          <Grid
            container
            p={5}
            justifyContent="center"
            alignItems="center"
            rowSpacing={4}
          >
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="dd/MM/yyyy"
                  value={newBooking.startDate?.substring(0, 10)}
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
                  value={newBooking.endDate?.substring(0, 10)}
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
                    <Checkbox
                      checked={roomsSave.indexOf(room.id as any) > -1}
                    />
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
              style={{ width: 625, height: 100 }}
              value={newBooking.note}
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
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ mb: 3 }}
                onClick={() => handleAddNewBooking()}
              >
                Add New Booking
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Button
            sx={{ mt: 2, float: "right" }}
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalAddBooking;
