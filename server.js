require("express-async-errors");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const user = require("./routes/user");
const profile = require("./routes/profile");
const property = require("./routes/property");

const app = express();

//DB setup
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());

//Config Passport strategy
require("./config/passport")(passport);

//API Route
app.use("/api/user/", user);
app.use("/api/profile/", profile);
app.use("/api/property/", property);

//Handling unhandled promises
process.on("unhandledRejection", (ex) => {
  throw ex;
});

//Server static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
