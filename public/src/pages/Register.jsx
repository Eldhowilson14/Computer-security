import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, provider } from "../config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { googleAuthRoute, registerRoute } from "../utils/routes";
import { Box, Input, Typography, Button } from "@mui/material";
import EncryptionService from "../utils/util";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("loop-chat-current-user")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;

      const { publicKey, privateKey } =
        await EncryptionService.generateKeyPair();
        
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        publicKey,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      localStorage.setItem(data.user._id, privateKey);
      if (data.status === true) {
        localStorage.setItem(
          "loop-chat-current-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  const HandleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const user = result.user;
      const idToken = await user.getIdToken();

      const { publicKey, privateKey } =
        await EncryptionService.generateKeyPair();
      const { data } = await axios.post(googleAuthRoute, {
        idToken,
        publicKey,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(data.user._id, privateKey);
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
          <Input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <Button type="submit">Create User</Button>
          <Typography className="formTypography">
            Already have an account ? <Link to="/login">Login.</Link>
          </Typography>
          <Button onClick={HandleGoogleSignUp}>Sign Up with Google</Button>
        </form>
      </Box>
      <ToastContainer />
    </>
  );
}
