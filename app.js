var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser"); //included by express generator we must provide secret key as argument
var logger = require("morgan");
//const session = require("express-session");
//const FileStore = require("session-file-store")(session); //2 sets of params after function call: required func is returning another as it second value, so we are calling the second function with the session parameter
const passport = require("passport");
//const authenticate = require("./authenticate");
const config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

const mongoose = require("mongoose");

const url = config.mongoUrl; //used to be const url = "mongodb://localhost:27017/nucampsite";
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
); //establishes connection to mongdb server

var app = express();

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    console.log(
      `Redirecting to: https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
    res.redirect(
      301,
      `https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("3142-0987-5436-66998")); //we must provide secret key as argument, it can be any string and it will be used by cookie parser to encrypt information. DO NOT USE IT WITH EXPRESS-SESSIONS
app.use(passport.initialize());
// app.use(
//   session({
//     name: "session-id",
//     secret: "3142-0987-5436-66998",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

//app.use(passport.initialize());
//app.use(passport.session()); //these two are only necessary is we're using session-based authentication

app.use("/", indexRouter);
app.use("/users", usersRouter);

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.user) {
//     const err = new Error("You are not authenticated!");
//     err.status = 401;
//     return next(err);
//   } else {
//     return next();
//   }
// }

//app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorite", favoriteRouter);

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
