const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");

//* Local User Model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "This email ID is not registered",
          });
        }
        //* Password Mathcing
        bcryptjs.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const token = createToken(user._id);
            const maxAge = 60 * 60;
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password incorrect! Please try again!",
            });
          }
        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

