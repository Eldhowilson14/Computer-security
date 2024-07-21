import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box, Tab, Tabs } from "@mui/material";
import { AddFriendList } from "./AddFriendList";
import { AcceptRequestList } from "./AcceptRequestList";
import { SentRequestList } from "./SentRequestList";

export default function AddFriendsDialog({ open, handleClose, currentUser, getFriendsList }) {
  const [tabValue, setTabValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
        sx={{
          maxHeight: "100vh",
          "& .MuiDialogContent-root": {
            padding: "24px",
          },
        }}
      >
        <DialogContent
          sx={{
            height: "500px",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="add friends tabs"
          >
            <Tab sx={{ width: "33.33%" }} label="Send Request" />
            <Tab sx={{ width: "33.34%" }} label="Request Sent" />
            <Tab sx={{ width: "33.33%" }} label="Accept Request" />
          </Tabs>
          <Box sx={{ width: "100%", mt: 2 }}>
            {tabValue === 0 && <AddFriendList currentUser={currentUser}/>}
            {tabValue === 1 && <SentRequestList currentUser={currentUser}/>}
            {tabValue === 2 && <AcceptRequestList currentUser={currentUser} getFriendsList={getFriendsList} />}
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
