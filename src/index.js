const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const route = require("./routes/route")

const app = express();

dotenv.config()
app.use(express.json());
app.use(cookieParser())

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  app.use("/", route)

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  