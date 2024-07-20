const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const authRouter = require("./routes/authRouter");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

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

app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
