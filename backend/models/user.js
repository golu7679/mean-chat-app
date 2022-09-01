const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateSixDigit = require("../helper/helper-function");
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

generateOTPToken = () => {
  const otp = generateSixDigit();
  console.log("Your otp is ", otp);
  return jwt.sign({ otp: otp }, config.otpSecret, {
    expiresIn: "10m",
  });
};

UserSchema.statics.getUserById = function (id, callback) {
  User.findById(id, callback);
};

UserSchema.statics.getUserByemail = function (email, callback) {
  let query = { email: email };
  User.findOne(query, callback);
};

UserSchema.statics.getUsers = () => {
  return User.find({}, "-password");
};

UserSchema.statics.addUser = function (newUser, callback) {
  User.getUserByemail(newUser.email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user", status: 500 });
    if (user) {
      let error = { msg: "email is already in use", status: 400 };
      return callback(error);
    } else {
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
          if (err)
            return callback({
              msg: "There was an error registering the new user",
              status: 500,
            });
          newUser.otp = generateOTPToken();
          newUser.password = hash;
          newUser.save(callback);
        });
      });
    }
  });
};

UserSchema.statics.authenticate = function (email, password, callback) {
  User.getUserByemail(email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user", status: 500 });
    if (!user) {
      let error = { msg: "Wrong email or password", status: 400 };
      return callback(error);
    } else {
      bcryptjs.compare(password, user.password, (err, result) => {
        if (result === true) {
          if (user.otp) return callback({ msg: "Account is not verified", status: 403 });
          return callback(null, user);
        } else {
          let error = { msg: "Wrong email or password", status: 400 };
          return callback(error);
        }
      });
    }
  });
};

UserSchema.statics.sendOTP = function (email, callback) {
  User.getUserByEmail(email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user", status: 500 });
    if (!user) {
      let error = { msg: "Wrong email" };
      return callback(error);
    }
    jwt.verify(user.otp, config.otpSecret, function (err, decode) {
      if (err) {
        user.otp = generateOTPToken();
        user.save(callback);
      } else {
        console.log("Your otp is here", decode);
      }
    });
  });
};

UserSchema.statics.verifyUser = function (email, otp, callback) {
  User.getUserByEmail(email, (err, user) => {
    if (err) return callback({ msg: "There was an error on getting the user", status: 500 });
    if (!user) {
      let error = { msg: "Wrong email" };
      return callback(error);
    } else {
      jwt.verify(user.otp, config.otpSecret, function (err, decode) {
        if (err) callback({ msg: "OTP expired", status: 400 });
        if (otp === decode) {
        } else {
          callback({});
        }
      });
    }
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
