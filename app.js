const mongoose = require("mongoose");
const express = require("express");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const pageRoute = require('./routes/pageRoute');
const authRoute = require('./routes/authRoute');
var cookieParser = require('cookie-parser');

const app = express();

log = console.log;
//* Passport Configuration
require('./config/passport')(passport);

//* Connect to DB
mongoose
  .connect('mongodb://localhost:27017/authHomework', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/authHomework',
    }),
  })
);
app.use(flash());

//*Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Handlebar settings
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', './views'); //It is already default

//* Router
app.use('/', pageRoute);
app.use('/auth', authRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Started in port ${PORT}`);
});

