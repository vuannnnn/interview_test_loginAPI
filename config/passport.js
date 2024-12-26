//JWT
const config = require("./config.json").development;
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../db/models").user;

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.passportSecret;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // req.user <= foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
