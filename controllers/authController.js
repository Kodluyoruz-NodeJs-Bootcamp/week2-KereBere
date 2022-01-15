const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { cookie } = require('express/lib/response');
dotenv.config();

exports.register = (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 8) {
    errors.push({ msg: 'Passpord must be at least 8 characters' });
  }

  if (errors.length > 0) {
    res.status(201).render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: 'This Emai is already taken' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash('succes_msg', 'Account Created');
                console.log(user);
                const token = createToken(user._id);
                const maxAge = 60 * 30;
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
                res
                  .status(201)
                  .json({ user: user._id, token: token, cookie: cookie });
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};
exports.login = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  User.findOne({
    email: email,
  }).then((user) => {
    //------------ Password Matching ------------//
    bcryptjs.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        req.session.userID = user._id;

        //Create and set jwt
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '30m',
          }
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 1800000,
        });
        if (verifyTokens(req.session, token)) {
          res.status(200).redirect('wellcome');
        }
      } else {
        return 'Password incorrect! Please try again.';
      }
    });
  });
};

function createToken(id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m',
  });
}

function verifyTokens(session, token) {
  const sessionID = String(session.userID);
  const tokenID = jwt.decode(token)._id;
  const sessionUserAgent = session.userAgent;
  const tokenUserAgent = jwt.decode(token).userAgent;

  if (sessionID === tokenID && sessionUserAgent === tokenUserAgent) {
    return true;
  } else {
    return false;
  }
}
