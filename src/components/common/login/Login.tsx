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
import { IUserInputLogin } from "../../../interfaces/user.interface";

const Login = () => {
  const [user, setUser] = useState<IUserInputLogin>({
    email: "",
    password: "",
  });

  const [err, setErr] = useState<string>("");

  const onChangeInputLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const loginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8080/api/users/login", { ...user })
      .then((response) => {
        delete response.data.password;

        localStorage.setItem("userInfo", JSON.stringify(response.data));

        window.location.href = response.data.role === "admin" ? "/admin" : "/";
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
          LOGIN
        </Typography>
        {err && <Alert severity="error">{err}</Alert>}
        <form style={{ marginTop: "1rem" }} onSubmit={loginSubmit}>
          <TextField
            margin="normal"
            required={true}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={user.email}
            onChange={onChangeInputLogin}
          />
          <TextField
            margin="normal"
            required={true}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={user.password}
            onChange={onChangeInputLogin}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/">Go back home.</Link>
            </Grid>
            <Grid item>
              Don't have an account?
              <Link to="/register">{" Register."}</Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
