import { Box, Fab } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const style = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

interface IAddButtonProps {
  on: boolean;
  setOn: Function;
}

const AddButton = ({ on, setOn }: IAddButtonProps) => (
  <Box sx={{ "& > :not(style)": { m: 1 } }} onClick={() => setOn(true)}>
    <Fab color="primary" aria-label="add" sx={style}>
      <AddIcon />
    </Fab>
  </Box>
);

export default AddButton;
