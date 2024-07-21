import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { friendsList, host, relayRoutes } from "../utils/routes";
import Dashboard from "../components/Dashboard";
import Welcome from "../components/Welcome";
import { Box } from "@mui/material";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [hisPublicKey, setHisPublicKey] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("loop-chat-current-user")) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(localStorage.getItem("loop-chat-current-user"))
      );
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host, {
        withCredentials: true
      });
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const getFriendsList = () => {
    if (currentUser) {
      const url = friendsList.replace('{userId}', currentUser._id)
      if (currentUser.isAvatarImageSet) {
        axios.get(url).then((data) => {
          setContacts(data.data);
        });
      } else {
        navigate("/setAvatar");
      }
    }
  }

  useEffect(() => {
    getFriendsList();
  }, [currentUser]);
  const handleChatChange = async (chat) => {

    setCurrentChat(chat);
    try {
      const response = await axios.post(relayRoutes, { chatUserId: chat._id });
      const hisPublicKey = response.data.hisPublicKey;

      
      setHisPublicKey(hisPublicKey);
    } catch (error) {
      console.log(error);
      console.log("error fetching publicKey");
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: "#131324",
      }}
    >
      <Box
        sx={{
          height: "85vh",
          width: "85vw",
          backgroundColor: "#00000076",
          display: "grid",
          gridTemplateColumns: "25% 75%",
          "@media screen and (min-width: 720px) and (max-width: 1080px)": {
            gridTemplateColumns: "35% 65%",
          },
        }}
      >
        <Dashboard contacts={contacts} changeChat={handleChatChange} getFriendsList={getFriendsList} currentUser={currentUser}/>
        {currentChat === undefined || !hisPublicKey  ? (
          <Welcome />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
