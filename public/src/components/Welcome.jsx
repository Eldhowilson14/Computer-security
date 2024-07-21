import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";
import { Box } from "@mui/material";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUserName(
       JSON.parse(
        localStorage.getItem("loop-chat-current-user")
      ).username
    );
  }, []);
  return (
    <Box sx={{
      display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    flexFirection: "column",
    }}>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>

    </Box>
  );
}
