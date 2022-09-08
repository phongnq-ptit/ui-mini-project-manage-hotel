import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IUserInputRegister } from "../../../interfaces/user.interface";

const Register = () => {
  const [newUser, setNewUser] = useState<IUserInputRegister>({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
    comfirmPassword: "",
  });

  const [err, setErr] = useState<string>("");

  const [successful, setSuccessful] = useState<string>("");

  const onChangeRegisterLogin = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const registerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newUser.password !== newUser.comfirmPassword) {
      setErr("Confirm the password does not match!");
      return;
    }

    await axios
      .post("http://localhost:8080/api/users/register", { ...newUser })
      .then((response) => {
        setSuccessful("Register successful!!");
        setErr("");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      })
      .catch((error) => {
        setErr(error.response.data.msg);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          REGISTER
        </Typography>
        {err && <Alert severity="error">{err}</Alert>}
        {successful && <Alert severity="success">{successful}</Alert>}
        <form style={{ marginTop: "1rem" }} onSubmit={registerSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={onChangeRegisterLogin}
                value={newUser.email}
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
                onChange={onChangeRegisterLogin}
                value={newUser.name}
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={onChangeRegisterLogin}
                value={newUser.address}
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={onChangeRegisterLogin}
                value={newUser.phone}
                required
                fullWidth
                type="number"
                id="phone"
                label="Phone"
                name="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={onChangeRegisterLogin}
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
                onChange={onChangeRegisterLogin}
                value={newUser.comfirmPassword}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item xs>
              <Link to="/">Go back home.</Link>
            </Grid>
            <Grid item>
              Already have an account?
              <Link to="/login"> Login.</Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
