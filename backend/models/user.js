const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper-function");
const config = require("../config");

// user schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
});

UserSchema.statics.getUserById = function(id, callback) {
  User.findById(id, callback);
};

UserSchema.statics.getUserByemail = function(email, callback) {
  let query = { email: email };
  User.findOne(query, callback);
};

UserSchema.statics.getUsers = () => {
  return User.find({}, "-password");
};

UserSchema.statics.addUser = function(newUser, callback) {
  User.getUserByemail(newUser.email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user" , status: 500});
    if (user) {
      let error = { msg: "email is already in use", status: 400 };
      return callback(error);
    } else {
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
          if (err)
            return callback({
              msg: "There was an error registering the new user",
             status: 500});

          newUser.otp = jwt.sign({ otp: helper() }, config.otpSecret, {
            expiresIn: 600000
          })
          newUser.password = hash;
          newUser.save(callback);
        });
      });
    }
  });
};

UserSchema.statics.authenticate = function(email, password, callback) {
  User.getUserByemail(email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user" });
    if (!user) {
      let error = { msg: "Wrong email or password" };
      return callback(error);
    } else {
      bcryptjs.compare(password, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          let error = { msg: "Wrong email or password" };
          return callback(error);
        }
      });
    }
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
