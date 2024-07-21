import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { Logout } from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/routes";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import EncryptionService from "../utils/util";

export default function ChatContainer({ currentUser, currentChat, socket, hisPublicKey }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState(null);
  const [ourDecryptionKey, setOurDecryptionKey] = useState(null);

  useEffect(() => {
    const myPrivateKey = localStorage.getItem(currentUser._id);
    EncryptionService.getDecryptionKey(myPrivateKey, hisPublicKey).then(
      (decryptionKey) => {
        setDecryptionKey(decryptionKey);
      }
    );

    EncryptionService.getEncryptionKey(myPrivateKey, hisPublicKey).then(
      (decryptionKey) => {
        setOurDecryptionKey(decryptionKey);
      }
    );
  }, []);

  useEffect(() => {
    if (decryptionKey) {
      const currentUser = JSON.parse(
        localStorage.getItem("loop-chat-current-user")
      );
      // loading chats when a user's chat is clicked
      axios
        .post(recieveMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        })
        .then(async (response) => {
          const decryptedMessages = await Promise.all(
            response.data.map(async (data) => {
              let decryptedMessage = "";
              if (data.from === currentUser._id) {
                decryptedMessage = await EncryptionService.decryptMessage(
                  data.message,
                  ourDecryptionKey
                );
              } else {
                decryptedMessage = await EncryptionService.decryptMessage(
                  data.message,
                  decryptionKey
                );
              }
              return { ...data, message: decryptedMessage };
            })
          );
          setMessages(decryptedMessages);
        })
        .catch((error) => {
          console.error("error fetching and decrypting messages", error);
        });
    }
  }, [currentChat, decryptionKey]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem("loop-chat-current-user")
    );

    const myPrivateKey = localStorage.getItem(currentUser._id);

    const encryptionKey = await EncryptionService.getEncryptionKey(
      myPrivateKey,
      hisPublicKey
    );

    const encryptedMessage = await EncryptionService.encryptMessage(
      msg,
      encryptionKey
    );

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg: encryptedMessage,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: encryptedMessage,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current && decryptionKey) {
      socket.current.on("msg-recieve", async (msg) => {
        try {
          const decryptedMessage = await EncryptionService.decryptMessage(
            msg,
            decryptionKey
          );
          setArrivalMessage({ fromSelf: false, message: decryptedMessage });
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [decryptionKey]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "10% 80% 10%",
        gap: "0.1rem",
        overflow: "hidden",
        "@media screen and (min-width: 720px) and (max-width: 1080px)": {
          gridTemplateRows: "15% 70% 15%",
        },
      }}
    >
      <Grid container className="chatHeader">
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Avatar
            className="avatar"
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
          />
          <Typography className="userName" variant="h6">
            {currentChat.username}
          </Typography>
        </Box>
        <Logout />
      </Grid>
      <Box
        sx={{
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "auto",
        }}
      >
        {decryptionKey && messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Box>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Box>
  );
}
