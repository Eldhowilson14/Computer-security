import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, provider } from "../config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute, googleAuthRoute } from "../utils/routes";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import EncryptionService from "../utils/util";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("loop-chat-current-user")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "loop-chat-current-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  const HandleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const { publicKey, privateKey } = await EncryptionService.generateKeyPair()

      const { data } = await axios.post(googleAuthRoute, {
        idToken,
        publicKey,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      if (data.new === true) {
        localStorage.setItem(data.user._id, privateKey);
      }
      if (data.status === true) {
        localStorage.setItem(
          "loop-chat-current-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    } catch (error) {
      console.error("error signing up with google", error);
      toast.error("Google Sign-Up failed. Please try again.", toastOptions);
    }
  };

  return (
    <>
      <Box className="formContainer">
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Microsoft_Loop_logo.svg/1200px-Microsoft_Loop_logo.svg.png"
              }
              alt="logo"
            />
            <h1>LoopChat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <Button sx={{ height: "3rem" }} type="submit">
            Log In
          </Button>
          <Typography className="formTypography">
            Don't have an account ? <Link to="/register">Create One.</Link>
          </Typography>
          <Button onClick={HandleGoogleSignIn}>Signin with Google</Button>
        </form>
      </Box>
      <ToastContainer />
    </>
  );
}
