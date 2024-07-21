import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutRoute } from "../utils/routes";
import {
  Avatar,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

export default function Dashboard({ contacts, changeChat, currentUser, getFriendsList}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const HandleLogOut = async () => {
    const id = await JSON.parse(
      localStorage.getItem("loop-chat-current-user")
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("loop-chat-current-user")
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "10% 8% 65% 15%",
              overflow: "hidden",
              backgroundColor: "#080420",
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{ gap: 1 }}
            >
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Microsoft_Loop_logo.svg/1200px-Microsoft_Loop_logo.svg.png"
                }
                alt="logo"
                style={{ height: "2rem" }}
              />
              <Typography
                sx={{ textTransform: "capitalize" }}
                variant="h5"
                color="white"
                component="h5"
              >
                LoopChat
              </Typography>
            </Grid>
            <Box className="dashboardChatsTopBar">
              <Button variant="contained" onClick={handleClickOpen}>
                Add Friends
              </Button>
              <Button variant="contained" onClick={HandleLogOut}>
                Logout
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "auto",
                gap: "0.8rem",
              }}
            >
              <List className="dashboardChats" sx={{ width: "90%" }}>
                {contacts.map((contact, index) => (
                  <ListItem
                    className={`chat ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    key={contact._id}
                    // button
                    onClick={() => changeCurrentChat(index, contact)}
                    sx={{
                      ...(index === currentSelected && {
                        backgroundColor: "#9a86f3",
                      }),
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      className="username"
                      primary={contact.username}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Grid className="currentUser">
              <Avatar
                className="avatar"
                src={`data:image/svg+xml;base64,${currentUserImage}`}
              />
              <Typography className="username" variant="h2" color="white">
                {currentUserName}
              </Typography>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
