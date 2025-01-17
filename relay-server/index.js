const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const relayRoutes = require("./routes/relay");
const app = express();
require("dotenv").config();

function handleShutDown(signal){
  console.log(`recieved signal ${signal}.`)
}

process.on('SIGINT',handleShutDown)
process.on('SIGTERM',handleShutDown)

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/relay", relayRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
