require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let refreshTokens = [];
const authRoute = require("./routers/authRoutes");

//DB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => app.listen(process.env.PORT || 4000))
  .then((res) => console.log("Connecteed to port 4000"))
  .catch((err) => console.log(err));

//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/auth", authRoute);
