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
  if (!(req.body.password === req.body.confirmPass)) {
    let err = "The passwords don't match";
    return next(err);
  } else {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    User.addUser(newUser, (err, user) => {
      if (err) {
        response.msg = err.msg || "Failed to register user";
        res.json(response);
      } else {
        response.success = true;
        response.msg = "User registered successfuly";
        response.user = {
          id: user._id,
          email: user.email,
        };
        console.log("[%s] registered successfuly", user.email);
        res.json(response);
      }
    });
  }
});

router.post("/authenticate", (req, res, next) => {
  let body = req.body;
  let response = { success: false };

  User.authenticate(body.email.trim(), body.password.trim(), (err, user) => {
    if (err) {
      response.msg = err.msg;
      res.json(response);
    } else {
      // create the unique token for the user
      let signData = {
        id: user._id,
        email: user.email,
      };
      let token = jwt.sign(signData, config.secret, {
        expiresIn: 604800,
      });

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
