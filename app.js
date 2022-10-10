var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser"); //included by express generator we must provide secret key as argument
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");

const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/nucampsite";
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
); //stablishes connection to mongdb server

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("3142-0987-5436-66998")); //we must provide secret key as argument, it can be any string and it will be used by cookie parser to encrypt information

//Basic Authentication, place here so user needs to be authenticated BEFORE they reach static info, if not move it below
//write authentication function from scratch:
function auth(req, res, next) {
  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err = new Error("You are not authenticated");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    //use Buffer.from() (global object) to create new buffer filled with specific string, array, or buffer
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const user = auth[0];
    const pass = auth[1];
    if (user === "admin" && pass === "password") {
      res.cookie("user", "admin", { signed: true });
      return next(); //user is authorized
    } else {
      const err = new Error("You are not authenticated");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.signedCookies.user === "admin") {
      return next();
    } else {
      const err = new Error("You are not authenticated");
      err.status = 401;
      return next(err);
    }
  }
}
app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page (error in catch for promise leads here)
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
