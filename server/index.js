const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  return res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
