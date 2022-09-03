const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const log = require("../log");

// register
router.post("/register", (req, res, next) => {
  let response = {};

  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      console.log(err);
      response.msg = err.msg || "Failed to register user";
      res.status(err.status || 400).json(response);
    } else {
      response.msg = "User registered successfully";
      delete user.password;
      delete user.otp;
      response.user = user;
      console.log("[%s] registered successfully", user.email);
      res.json(response);
    }
  });
});

router.post("/verify_otp", (req, res, next) => {
  const { email, otp } = req.body;
  User.verifyUser(email, otp, (err, user) => {
    if (err) {
      res.status(err.status).json(err.msg);
    } else {
      res.json({ msg: "Account activated" });
    }
  });
});

router.post("/login", (req, res, next) => {
  let body = req.body;
  let response = {};

  User.authenticate(body.email.trim(), body.password.trim(), (err, user) => {
    if (err) {
      response.msg = err.msg;
      console.log(err);
      res.status(err.status).json(response);
    } else {
      // create the unique token for the user
      let signData = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      response.token = jwt.sign(signData, config.tokenSecret);
      response.user = signData;
      response.msg = "User authenticated successfully";
      console.log("[%s] authenticated successfully", user.email);
      res.json(response);
    }
  });
});

// profile
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res, next) => {
  let response = {};
  response.msg = "Profile retrieved successfully";
  response.user = req.user;
  res.json(response);
});

// user list
router.get("/", (req, res, next) => {
  User.getUsers()
    .then(users => {
      let response = {
        users: users,
      };
      return res.json(response);
    })
    .catch(err => {
      log.err("mongo", "failed to get users", err.message || err);
      return next(new Error("Failed to get users"));
    });
});

module.exports = router;
