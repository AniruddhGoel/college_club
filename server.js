require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('./src/dbConnect/db');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
var session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
var app = express();
const port = process.env.PORT || 3000;
// model
const User = require('./src/models/user');
// Routes
var defaultRoute = require('./routes/defaultRoute');
var adminRoute = require('./routes/adminDashRoute');
var commonRoute = require('./routes/commonRoute');

// session db selection
const store = new mongodbsession({
  uri: 'mongodb://Shido94:Rupesh94$@ds155076.mlab.com:55076/club',
  // uri: '',
  collection: "session"
});

// view engine setup
app.use(express.static(path.join(__dirname, '/public')));
app.use(compression());
app.use(helmet());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var csrfProtection = csrf({ cookie: true });
app.use(cookieParser());
app.use(session({
  secret: 'devil',
  saveUninitialized: false,
  resave: false,
  store: store,
  cookie: {
    maxAge: 3600000
  }
}));
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) =>{
  res.locals.csrfToken = req.csrfToken();
  res.locals.validate = req.session.validate;
  res.locals.status = req.session.status;
  next();
});

app.use('/', defaultRoute);
app.use('/common/', commonRoute);
app.use('/admin/', adminRoute);
app.listen(port, function () {
  console.log("Server started at :", port);
});
