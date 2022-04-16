const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { reququestAuth, checkUser } = require("./middleWares/auth");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
mongoose
  .connect(process.env.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000, () => console.log("server up")))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", reququestAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
