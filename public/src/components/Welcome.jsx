import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";
import { Box } from "@mui/material";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("loop-chat-current-user")
    )

    if (user) {
      setUserName(
        user.username
      );

    }
  }, []);
  return (
    <Box sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    flexDirection: "column",
    }}>
      <img style={{
        height: "20rem"
      }} src={Robot} alt="" />
      <h1>
        Welcome, <span style={{color: "#4e0eff"}}>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>

    </Box>
  );
}
