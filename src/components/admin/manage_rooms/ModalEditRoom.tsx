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
import React, { useContext, useEffect, useState } from "react";
import { IManageRooms, IRoom } from "../../../interfaces/room.interface";
import ImageCPN from "../../common/image/ImageCPN";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { RoomContext } from "../../../context/RoomContext";

interface IModalEditRoom {
  dataRoom: IManageRooms;
  setDataRoom: Function;
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

const ModalEditRoom = ({ dataRoom, setDataRoom }: IModalEditRoom) => {
  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [roomDetail, setRoomDetail] = useState<IRoom>({} as IRoom);

  const { isAdmin } = useContext(UserContext);

  const { listRoom, reload, setReload } = useContext(RoomContext);

  useEffect(() => {
    const getRoomDetail = async () => {
      await axios
        .get(`http://localhost:8080/api/rooms/${dataRoom.roomId}`)
        .then((response) => {
          setRoomDetail(response.data);
        })
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
        });
    };

    getRoomDetail();
  }, [listRoom, dataRoom.roomId]);

  const onChangeEditRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    console.log(event.target.value);

    setRoomDetail({
      ...roomDetail,
      [name]: value,
    });
  };

  const onChangeSelectActiveInput = (event: SelectChangeEvent) => {
    const name = event.target.name;
    const active = event.target.value;

    setRoomDetail({
      ...roomDetail,
      [name]: active === "true" ? true : false,
    });
  };

  const onChangeSelectRoomTypeInput = (event: SelectChangeEvent) => {
    const nameRoomType = event.target.name;
    const roomType = event.target.value;
    const nameCapacity = "capacity";
    const capacity = roomType === "single" ? 1 : roomType === "double" ? 2 : 3;

    setRoomDetail({
      ...roomDetail,
      [nameRoomType]: roomType,
      [nameCapacity]: capacity,
    });
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setRoomDetail({
      ...roomDetail,
      [name]: value,
    });
  };

  const onSubmitEditRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .put(`http://localhost:8080/api/rooms/${roomDetail.id}`, {
        ...roomDetail,
      })
      .then((response) => {
        setErr("");
        setSuccessful(response.data.msg);
        setReload(!reload);
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
        // add image to room_images table
        axios
          .post("http://localhost:8080/api/room_images", {
            url: response.data.keyName,
            roomId: roomDetail.id,
          })
          .then((response) => {
            setSuccessful(response.data.msg);
            setErr("");
            setReload(!reload);
            setTimeout(() => {
              setSuccessful("");
            }, 2000);
          })
          .catch((error) => {
            setErr(error.response.data.msg);
            setSuccessful("");
          });
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  const handleDestroy = async (
    keyNameItemImageOfRoom: string,
    idItemImageOfRoom: number
  ) => {
    if (!isAdmin) {
      setErr("You are not Admin!!");
      setSuccessful("");
      return;
    }

    // delete image of room by id
    await axios
      .delete(`http://localhost:8080/api/room_images/${idItemImageOfRoom}`)
      .then((response) => {})
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });

    // delete image in image_upload table
    await axios
      .delete(`http://localhost:8080/api/upload/${keyNameItemImageOfRoom}`)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  return (
    <div>
      <Modal
        open={dataRoom.onEdit}
        onClose={() => setDataRoom({ ...dataRoom, onEdit: false })}
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
                Edit The Room Profile
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={() => setDataRoom({ ...dataRoom, onEdit: false })}
                variant="contained"
              >
                <CloseIcon />
              </Button>
            </Grid>
          </Grid>
          <Divider />
          {err && <Alert severity="error">{err}</Alert>}
          {successful && <Alert severity="success">{successful}</Alert>}
          <Grid container>
            {roomDetail.roomImages?.map((imageRoom) => {
              return (
                <Grid item xs={4} key={imageRoom.id}>
                  <ImageCPN
                    imageKeyName={imageRoom.url}
                    imageId={imageRoom.id ? imageRoom.id : 0}
                    handleDestroy={handleDestroy}
                  />
                </Grid>
              );
            })}
          </Grid>
          {roomDetail.roomImages?.length < 6 && (
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
          <form style={{ marginTop: "1rem" }} onSubmit={onSubmitEditRoom}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  value={roomDetail.roomNumber}
                  onChange={onChangeEditRoom}
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
                  value={roomDetail.floor}
                  onChange={onChangeEditRoom}
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
                  value={roomDetail.price}
                  onChange={onChangeEditRoom}
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
                  value={roomDetail.roomType}
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
                  value={roomDetail.description}
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
                  value={roomDetail.note}
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
                  value={roomDetail.active === true ? "true" : "false"}
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
              Update
            </Button>
          </form>
          <Divider />
          <Button
            sx={{ mt: 2, float: "right" }}
            variant="contained"
            onClick={() => {
              setDataRoom({ ...dataRoom, onEdit: false });
              setErr("");
              setSuccessful("");
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEditRoom;
