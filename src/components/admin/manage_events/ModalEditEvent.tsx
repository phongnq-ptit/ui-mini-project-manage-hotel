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
import React, { useContext, useEffect, useState } from "react";
import ImageCPN from "../../common/image/ImageCPN";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { IEvent, IManageEvents } from "../../../interfaces/event.interface";
import { EventContext } from "../../../context/EventContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface IModalEditEvent {
  dataEvent: IManageEvents;
  setDataEvent: Function;
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

const ModalEditEvent = ({ dataEvent, setDataEvent }: IModalEditEvent) => {
  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const [eventDetail, setEventDetail] = useState<IEvent>({} as IEvent);

  const { isAdmin } = useContext(UserContext);

  const { listEvent, reload, setReload } = useContext(EventContext);

  useEffect(() => {
    const getEventDetail = async () => {
      await axios
        .get(`http://localhost:8080/api/events/${dataEvent.eventId}`)
        .then((response) => {
          setEventDetail(response.data);
        })
        .catch((error) => {
          setErr(error.response.data.msg);
          setSuccessful("");
        });
    };

    getEventDetail();
  }, [listEvent, dataEvent.eventId]);

  const onChangeEditEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEventDetail({
      ...eventDetail,
      [name]: value,
    });
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setEventDetail({
      ...eventDetail,
      [name]: value,
    });
  };

  const onChangeStartDate = (date: Date | null) => {
    const name = "startDate";

    setEventDetail({
      ...eventDetail,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });
  };

  const onChangeEndDate = (date: Date | null) => {
    const name = "endDate";

    setEventDetail({
      ...eventDetail,
      [name]:
        date === null
          ? new Date().toJSON()
          : new Date(date).toISOString().slice(0, 10),
    });
  };

  const onSubmitEditEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .put(`http://localhost:8080/api/events/${dataEvent.eventId}`, {
        startDate: eventDetail.startDate?.substring(0, 10) + "T00:00:00",
        endDate: eventDetail.endDate?.substring(0, 10) + "T00:00:00",
        title: eventDetail.title,
        description: eventDetail.description,
        banner: eventDetail.banner,
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
        // add image to events table
        axios
          .put(`http://localhost:8080/api/events/${eventDetail.id}`, {
            ...eventDetail,
            banner: response.data.keyName,
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
    keyNameBannerOfEvent: string,
    eventId: number
  ) => {
    if (!isAdmin) {
      setErr("You are not Admin!!");
      setSuccessful("");
      return;
    }

    axios
      .put(`http://localhost:8080/api/events/${eventId}`, {
        ...eventDetail,
        banner: "",
      })
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
        open={dataEvent.onEdit}
        onClose={() => setDataEvent({ ...dataEvent, onEdit: false })}
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
                Edit The Event Profile
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={() => setDataEvent({ ...dataEvent, onEdit: false })}
                variant="contained"
              >
                <CloseIcon />
              </Button>
            </Grid>
          </Grid>
          <Divider />
          {err && <Alert severity="error">{err}</Alert>}
          {successful && <Alert severity="success">{successful}</Alert>}
          <Box display="flex" justifyContent="center" alignItems="center">
            <ImageCPN
              imageKeyName={eventDetail.banner}
              imageId={dataEvent.eventId}
              handleDestroy={handleDestroy}
            />
          </Box>
          {!eventDetail.banner && (
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
          <form style={{ marginTop: "1rem" }} onSubmit={onSubmitEditEvent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="dd/MM/yyyy"
                    value={eventDetail.startDate?.substring(0, 10)}
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
                    value={eventDetail.endDate?.substring(0, 10)}
                    onChange={onChangeEndDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={eventDetail.title}
                  onChange={onChangeEditEvent}
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
                  value={eventDetail.description}
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
              Update
            </Button>
          </form>
          <Divider />
          <Button
            sx={{ mt: 2, float: "right" }}
            variant="contained"
            onClick={() => {
              setDataEvent({ ...dataEvent, onEdit: false });
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

export default ModalEditEvent;
