import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";

export default function Login() {
  return (
    <Box className="loginCard">
      <form action="">
        <div className="logo">
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Microsoft_Loop_logo.svg/1200px-Microsoft_Loop_logo.svg.png"
            }
            alt="logo"
          />
          <h1>LoopChat</h1>
        </div>
        <input type="text" placeholder="Username" name="username" min="3" />
        <input type="password" placeholder="Password" name="password" />
        <Button sx={{ height: "3rem" }} type="submit">
          Log In
        </Button>
        <Typography className="signUpUrl">
          Don't have an account ? <Link to="#">Create One.</Link>
        </Typography>
      </form>
    </Box>
  );
}
