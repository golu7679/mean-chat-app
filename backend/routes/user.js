const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const log = require("../log");

// register
router.post("/register", (req, res, next) => {
  let response = { success: false };

  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      response.msg = err.msg || "Failed to register user";
      res.status(err.status).json(response);
    } else {
      response.success = true;
      response.msg = "User registered successfully";
      delete user.password;
      delete user.otp;
      response.user = user;
      console.log("[%s] registered successfully", user.email);
      res.json(response);
    }
  });
});

router.post("/verify_account", (req, res, next) => {
  const { email, otp } = req.body;
  User.verifyUser(email, otp, (err, user) => {
    if (err) {
      res.status(err.status).json(err.msg);
    } else {
      res.json({ msg: "Acount activated" });
    }
  });
});

router.post("/login", (req, res, next) => {
  let body = req.body;
  let response = { success: false };

  User.authenticate(body.email.trim(), body.password.trim(), (err, user) => {
    if (err) {
      response.msg = err.msg;
      res.status(err.status).json(response);
    } else {
      // create the unique token for the user
      let signData = {
        id: user._id,
        email: user.email,
      };
      let token = jwt.sign(signData, config.tokenSecret);

      response.token = "JWT " + token;
      response.user = signData;
      response.success = true;
      response.msg = "User authenticated successfully";

      console.log("[%s] authenticated successfully", user.email);
      res.json(response);
    }
  });
});

// profile
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res, next) => {
  let response = { success: true };
  response.msg = "Profile retrieved successfully";
  response.user = req.user;
  res.json(response);
});

// user list
router.get("/", (req, res, next) => {
  User.getUsers()
    .then(users => {
      let response = {
        success: true,
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
