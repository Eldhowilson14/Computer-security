const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const mongoose = require("mongoose");

require("dotenv").config();

function handleShutDown(signal){
  console.log(`recieved signal ${signal}.`)
}

process.on('SIGINT',handleShutDown)
process.on('SIGTERM',handleShutDown)

const app = express();
const authRouter = require("./routes/authRouter");
const messageRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (_req, res) => {
  return res.json({ msg: "Hello World!" });
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://20.13.153.6:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

