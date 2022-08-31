const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("./index");

module.exports = passport => {
  let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: config.tokenSecret,
  };

  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.getUserById(jwt_payload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          let signData = {
            id: user._id,
            email: user.email,
          };
          return done(null, signData);
        } else {
          return done(null, false);
        }
      });
    }),
  );
};
