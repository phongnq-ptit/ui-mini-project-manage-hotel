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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { IUserInputRegister } from "../../../interfaces/user.interface";

interface IModalAddUser {
  onAddUser: boolean;
  setOnAddUser: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const ModalAddUser = ({ onAddUser, setOnAddUser }: IModalAddUser) => {
  const [newUser, setNewUser] = useState<IUserInputRegister>({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
    comfirmPassword: "",
    role: "user",
  });

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const { reload, setReload } = useContext(UserContext);

  const onChangeAddUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const onChangeRoleUser = (event: SelectChangeEvent) => {
    const role: string = event.target.value;

    setNewUser({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      address: newUser.address,
      phone: newUser.phone,
      comfirmPassword: newUser.comfirmPassword,
      role: role,
    });
  };

  const handleSubmitAddUser = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (newUser.password !== newUser.comfirmPassword) {
      setSuccessful("");
      setErr("Confirm the password does not match!");
      return;
    }

    console.log(newUser);

    await axios
      .post("http://localhost:8080/api/users/register", { ...newUser })
      .then((response) => {
        setSuccessful(response.data.msg as string);
        setErr("");
        setReload(!reload);
      })
      .catch((error) => {
        setSuccessful("");
        setErr(error.response.data.msg);
      });
  };

  return (
    <div>
      <Modal
        open={onAddUser}
        onClose={() => setOnAddUser(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backgroundColor: "rgba(192,192,192,0.3)" }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Add new User profile
          </Typography>
          <Divider />
          {err && <Alert severity="error">{err}</Alert>}
          {successful && <Alert severity="success">{successful}</Alert>}
          <form style={{ marginTop: "1rem" }} onSubmit={handleSubmitAddUser}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={newUser.email}
                  onChange={onChangeAddUser}
                  type="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={newUser.name}
                  onChange={onChangeAddUser}
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={newUser.address}
                  onChange={onChangeAddUser}
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={newUser.phone}
                  onChange={onChangeAddUser}
                  required
                  fullWidth
                  type="number"
                  id="phone"
                  label="Phone"
                  name="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ display: "inline-block", mr: 2 }}>
                  Role:{" "}
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={newUser.role}
                  name="role"
                  onChange={onChangeRoleUser}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={onChangeAddUser}
                  value={newUser.password}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={newUser.comfirmPassword}
                  onChange={onChangeAddUser}
                  required
                  fullWidth
                  name="comfirmPassword"
                  label="Comfirm Password"
                  type="password"
                  id="comfirmPassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add a new User
            </Button>
          </form>
          <Divider />
          <Button
            sx={{ mt: 2, float: "right" }}
            variant="contained"
            onClick={() => {
              setOnAddUser(false);
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

export default ModalAddUser;
