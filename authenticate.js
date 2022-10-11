const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtraJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

exports.local = passport.use(new LocalStrategy(User.authenticate())); //LocalStrategy requires verified callback function
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
