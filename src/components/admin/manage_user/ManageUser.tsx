import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { IManageUsers, IUser } from "../../../interfaces/user.interface";
import AddButton from "../../common/add_button/AddButton";
import ModalAddUser from "./ModalAddUser";
import ModalEditUser from "./ModalEditUser";

const ManageUser = () => {
  const { listUsers, setRole } = useContext(UserContext);

  const [dataUser, setDataUser] = useState<IManageUsers>({
    userInfo: {} as IUser,
    onEdit: false,
    onChangePassword: false,
  });

  const [onAddUser, setOnAddUser] = useState<boolean>(false);

  return (
    <>
      <Box>
        <Typography sx={{ display: "inline", fontWeight: 500 }}>
          Change Role:{" "}
        </Typography>
        <Button onClick={() => setRole("none")}>All</Button>
        <Button onClick={() => setRole("user")}>Client</Button>
        <Button onClick={() => setRole("admin")}>Admin</Button>
      </Box>
      <Grid
        container
        sx={{
          borderRadius: 5,
          padding: 2,
          color: "darkblue",
          fontWeight: 900,
        }}
        alignItems="center"
        mt={2}
      >
        <Grid item xs={1}>
          <Typography>No</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Username</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Role</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Email</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Phone</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Address</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Action</Typography>
        </Grid>
      </Grid>
      {listUsers?.map((user, index) => (
        <Grid
          key={user.id}
          container
          sx={{ border: "1px solid #1a237e", borderRadius: 5, padding: 2 }}
          mt={2}
          alignItems="center"
        >
          <Grid item xs={1}>
            <Typography>{index + 1 + "."}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{user.name}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Chip
              label={user.role === "user" ? "client" : "admin"}
              color={user.role === "user" ? "info" : "warning"}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography>{user.email}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{user.phone}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{user.address}</Typography>
          </Grid>
          <Grid item xs={1} sx={{ float: "right" }}>
            <Button
              variant="contained"
              onClick={() =>
                setDataUser({
                  userInfo: user,
                  onEdit: true,
                  onChangePassword: false,
                })
              }
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      ))}
      <ModalAddUser onAddUser={onAddUser} setOnAddUser={setOnAddUser} />
      <ModalEditUser dataUser={dataUser} setDataUser={setDataUser} />
      <AddButton on={onAddUser} setOn={setOnAddUser} />
    </>
  );
};

export default ManageUser;
