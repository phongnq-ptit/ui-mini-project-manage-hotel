import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ImageCPN from "../../common/image/ImageCPN";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { EventContext } from "../../../context/EventContext";
import { INewEvent } from "../../../interfaces/event.interface";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface IModalAddEvent {
  onAddEvent: boolean;
  setOnAddEvent: Function;
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

const ModalAddEvent = ({ onAddEvent, setOnAddEvent }: IModalAddEvent) => {
  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [temporaryImage, setTemporaryImage] = useState<string>("");

  const { userInfo, isAdmin } = useContext(UserContext);

  const [newEvent, setNewEvent] = useState<INewEvent>({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    title: "",
    description: "",
    banner: "",
    staffId: userInfo.id!,
  });

  const { reload, setReload } = useContext(EventContext);

  const onChangeAddEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const onChangeStartDate = (date: Date | null) => {
    const name = "startDate";

    setNewEvent({
      ...newEvent,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });
  };

  const onChangeEndDate = (date: Date | null) => {
    const name = "endDate";

    setNewEvent({
      ...newEvent,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });
  };

  const onSubmitAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await axios
      .post(`http://localhost:8080/api/events`, {
        startDate: newEvent.startDate?.substring(0, 10) + "T00:00:00",
        endDate: newEvent.endDate?.substring(0, 10) + "T00:00:00",
        title: newEvent.title,
        description: newEvent.description,
        banner: temporaryImage,
        staffId: userInfo.id,
      })
      .then((response) => {
        setErr("");
        setSuccessful("Successful!!!");
        setReload(!reload);
        setTemporaryImage("");
        setNewEvent({
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date().toISOString().slice(0, 10),
          title: "",
          description: "",
          banner: "",
          staffId: userInfo.id!,
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
        setTemporaryImage(response.data.keyName);
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
        setTemporaryImage("");
      })
      .catch((error) => {
        setErr(error.response.data.msg);
        setSuccessful("");
      });
  };

  const handleClose = async () => {
    if (temporaryImage) {
      await axios
        .delete(`http://localhost:8080/api/upload/${temporaryImage}`)
        .then((response) => {})
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
        });
    }

    setOnAddEvent(false);
    setTemporaryImage("");
    setNewEvent({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      title: "",
      description: "",
      banner: "",
      staffId: userInfo.id!,
    });
  };

  return (
    <div>
      <Modal
        open={onAddEvent}
        onClose={() => setOnAddEvent(false)}
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
                Add The Event Profile
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
          <Box display="flex" justifyContent="center" alignItems="center">
            <ImageCPN
              imageKeyName={temporaryImage}
              imageId={0}
              handleDestroy={handleDestroy}
            />
          </Box>
          {!temporaryImage && (
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
          <form style={{ marginTop: "1rem" }} onSubmit={onSubmitAddEvent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="dd/MM/yyyy"
                    value={newEvent.startDate?.substring(0, 10)}
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
                    value={newEvent.endDate?.substring(0, 10)}
                    onChange={onChangeEndDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={newEvent.title}
                  onChange={onChangeAddEvent}
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Description:</Typography>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Description"
                  style={{ width: 675, height: 100 }}
                  value={newEvent.description}
                  name="description"
                  onChange={onChangeTextArea}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add a new event
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

export default ModalAddEvent;
