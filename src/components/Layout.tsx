import { Grid, CircularProgress, Box } from "@mui/material";
import { useContext } from "react";
import Header from "./common/header/Header";
import Navigation from "./common/navigation/Navigation";
import Pages from "./Pages";
import { UserContext } from "../context/UserContext";

const Layout = () => {
  const { isAdmin, loading } = useContext(UserContext);

  return (
    <Grid container>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      <Grid item xs={12}>
        <Header />
        {!isAdmin && <Pages />}
      </Grid>
      {isAdmin && (
        <>
          <Grid
            item
            xs={2}
            sx={{ backgroundColor: "lightblue", minHeight: "100vh" }}
          >
            <Navigation />
          </Grid>
          <Grid item xs={10} p={3}>
            <Pages />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Layout;
