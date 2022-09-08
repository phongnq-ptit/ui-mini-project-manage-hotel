import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { IRoom } from "../../../interfaces/room.interface";
import ImageCPN from "../../common/image/ImageCPN";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { RoomContext } from "../../../context/RoomContext";

interface IModalAddRoom {
  onAddRoom: boolean;
  setOnAddRoom: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  height: 700,
  overflow: "scroll",
};

const ModalAddRoom = ({ onAddRoom, setOnAddRoom }: IModalAddRoom) => {
  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [temporaryImages, setTemporaryImages] = useState<string[]>([]);

  const [newRoom, setNewRoom] = useState<IRoom>({
    floor: 0,
    roomNumber: 0,
    roomType: "single",
    price: 0,
    description: "",
    note: "",
    capacity: 1,
    roomImages: [],
  });

  const { isAdmin } = useContext(UserContext);

  const { reload, setReload } = useContext(RoomContext);

  const onChangeAddRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewRoom({
      ...newRoom,
      [name]: value,
    });
  };

  const onChangeSelectActiveInput = (event: SelectChangeEvent) => {
    const name = event.target.name;
    const active = event.target.value;

    setNewRoom({
      ...newRoom,
      [name]: active === "true" ? true : false,
    });
  };

  const onChangeSelectRoomTypeInput = (event: SelectChangeEvent) => {
    const nameRoomType = event.target.name;
    const roomType = event.target.value;
    const nameCapacity = "capacity";
    const capacity = roomType === "single" ? 1 : roomType === "double" ? 2 : 3;

    setNewRoom({
      ...newRoom,
      [nameRoomType]: roomType,
      [nameCapacity]: capacity,
    });
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setNewRoom({
      ...newRoom,
      [name]: value,
    });
  };

  const onSubmitAddRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(`http://localhost:8080/api/rooms`, {
        ...newRoom,
      })
      .then((response) => {
        // add images to room
        temporaryImages.map(async (image) => {
          await axios.post("http://localhost:8080/api/room_images", {
            url: image,
            roomId: response.data.id,
          });
        });

        setErr("");
        setSuccessful(response.data.msg);
        setReload(!reload);
        setTemporaryImages([]);
        setNewRoom({
          floor: 0,
          roomNumber: 0,
          roomType: "single",
          price: 0,
          description: "",
          note: "",
          roomImages: [],
        });
        setTimeout(() => {
          setSuccessful("");
        }, 2000);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!isAdmin) return setErr("You are not Admin!!");

    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      setErr("File does not exists!!");
      setSuccessful("");
      return;
    }

    if (file.size > 1024 * 1024) {
      setErr("File large more 1MB!!!!");
      setSuccessful("");
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setErr("File is not wrong JPG / PNG format !!");
      setSuccessful("");
      return;
    }

    let formData = new FormData();
    formData.append("file", file);

    // upload image on server
    await axios
      .post("http://localhost:8080/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setTemporaryImages([...temporaryImages, response.data.keyName]);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  const handleDestroy = async (
    keyNameItemImageOfRoom: string,
    indexImage: number
  ) => {
    if (!isAdmin) {
      setErr("You are not Admin!!");
      setSuccessful("");
      return;
    }

    // delete image in image_upload table
    await axios
      .delete(`http://localhost:8080/api/upload/${keyNameItemImageOfRoom}`)
      .then((response) => {
        temporaryImages.splice(indexImage, 1);
        setTemporaryImages([...temporaryImages]);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  const handleClose = async () => {
    temporaryImages.map(async (image) => {
      await axios
        .delete(`http://localhost:8080/api/upload/${image}`)
        .then((response) => {})
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
        });
    });
    setOnAddRoom(false);
    setTemporaryImages([] as string[]);
    setNewRoom({
      floor: 0,
      roomNumber: 0,
      roomType: "single",
      price: 0,
      description: "",
      note: "",
      roomImages: [],
    });
  };

  return (
    <div>
      <Modal
        open={onAddRoom}
        onClose={() => setOnAddRoom(false)}
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
                Add The Room Profile
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
          <Grid container>
            {temporaryImages?.map((image, index) => {
              return (
                <Grid item xs={4} key={index}>
                  <ImageCPN
                    imageKeyName={image}
                    imageId={index}
                    handleDestroy={handleDestroy}
                  />
                </Grid>
              );
            })}
          </Grid>
          {temporaryImages?.length < 6 && (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <input
                  type="file"
                  id="file_up"
                  name="file"
                  onChange={handleUpload}
                />
              </Grid>
            </Grid>
          )}
          <form style={{ marginTop: "1rem" }} onSubmit={onSubmitAddRoom}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  value={newRoom.roomNumber}
                  onChange={onChangeAddRoom}
                  type="number"
                  name="roomNumber"
                  required
                  fullWidth
                  id="roomNumber"
                  label="Room Number"
                  autoFocus
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={newRoom.floor}
                  onChange={onChangeAddRoom}
                  type="number"
                  required
                  fullWidth
                  id="floor"
                  label="Floor"
                  name="floor"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={newRoom.price}
                  onChange={onChangeAddRoom}
                  type="number"
                  required
                  fullWidth
                  id="price"
                  label="Price"
                  name="price"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ display: "inline-block", mr: 2 }}>
                  Room type:{" "}
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={newRoom.roomType}
                  name="roomType"
                  onChange={onChangeSelectRoomTypeInput}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="triple">Triple</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Description:</Typography>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Description"
                  style={{ width: 775, height: 100 }}
                  value={newRoom.description}
                  name="description"
                  onChange={onChangeTextArea}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Note:</Typography>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Note"
                  style={{ width: 775, height: 100 }}
                  value={newRoom.note}
                  name="note"
                  onChange={onChangeTextArea}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ display: "inline-block", mr: 2 }}>
                  Active:{" "}
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={newRoom.active === true ? "true" : "false"}
                  name="active"
                  onChange={onChangeSelectActiveInput}
                >
                  <MenuItem value="true">TRUE</MenuItem>
                  <MenuItem value="false">FALSE</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add a new Room
            </Button>
          </form>
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

export default ModalAddRoom;
