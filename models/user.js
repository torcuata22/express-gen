const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  //removed username and password because plugin will take care of that now
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
