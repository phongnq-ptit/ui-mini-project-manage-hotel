import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import {
  IManageUsers,
  IUserInputRegister,
} from "../../../interfaces/user.interface";

interface IModalEditUser {
  dataUser: IManageUsers;
  setDataUser: Function;
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

const ModalEditUser = ({ dataUser, setDataUser }: IModalEditUser) => {
  const [userUpdate, setUserUpdate] = useState<IUserInputRegister>(
    {} as IUserInputRegister
  );

  const [err, setErr] = useState<string>("");

  const [successful, setSuccesful] = useState<string>("");

  const { reload, setReload } = useContext(UserContext);

  // update information of userUpdate state
  useEffect(() => {
    setUserUpdate({
      email: dataUser.userInfo.email,
      password: dataUser.userInfo.password,
      name: dataUser.userInfo.name,
      address: dataUser.userInfo.address,
      phone: dataUser.userInfo.phone,
      comfirmPassword: dataUser.userInfo.password,
    });
  }, [dataUser]);

  const onChangeUpdateUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserUpdate({
      ...userUpdate,
      [name]: value,
    });
  };

  const submitUpdateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      dataUser.onChangePassword &&
      userUpdate.password !== userUpdate.comfirmPassword
    ) {
      setSuccesful("");
      setErr("Confirm the password does not match!");
      return;
    }

    axios
      .patch(`http://localhost:8080/api/users/${dataUser.userInfo.id}`, {
        ...userUpdate,
      })
      .then((response) => {
        setSuccesful(response.data.msg);
        setErr("");
        setReload(!reload);
      })
      .catch((error) => {
        setSuccesful("");
        setErr(error.response.data.msg);
      });
  };

  return (
    <div>
      <Modal
        open={dataUser.onEdit}
        onClose={() => setDataUser({ ...dataUser, onEdit: false })}
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
            Edit User
          </Typography>
          <Divider />
          {err && <Alert severity="error">{err}</Alert>}
          {successful && <Alert severity="success">{successful}</Alert>}
          <form style={{ marginTop: "1rem" }} onSubmit={submitUpdateUser}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={userUpdate.email}
                  onChange={onChangeUpdateUser}
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
                  value={userUpdate.name}
                  onChange={onChangeUpdateUser}
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={userUpdate.address}
                  onChange={onChangeUpdateUser}
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={userUpdate.phone}
                  onChange={onChangeUpdateUser}
                  required
                  fullWidth
                  type="number"
                  id="phone"
                  label="Phone"
                  name="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  checked={dataUser.onChangePassword}
                  onChange={() =>
                    setDataUser({
                      userInfo: dataUser.userInfo,
                      onEdit: dataUser.onEdit,
                      onChangePassword: !dataUser.onChangePassword,
                    })
                  }
                  sx={{
                    display: "block",
                    color: "#000",
                    mb: 2,
                  }}
                  control={<Switch name="loading" color="primary" />}
                  label={
                    <Typography sx={{ display: "inline" }}>
                      Change Password
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            {dataUser.onChangePassword && (
              <>
                <Grid item xs={12} mb={2}>
                  <TextField
                    onChange={onChangeUpdateUser}
                    value={userUpdate.password}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>
                <Grid item xs={12} mb={2}>
                  <TextField
                    value={userUpdate.comfirmPassword}
                    onChange={onChangeUpdateUser}
                    required
                    fullWidth
                    name="comfirmPassword"
                    label="Comfirm Password"
                    type="password"
                    id="comfirmPassword"
                  />
                </Grid>
              </>
            )}
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
              setDataUser({ ...dataUser, onEdit: false });
              setErr("");
              setSuccesful("");
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEditUser;
