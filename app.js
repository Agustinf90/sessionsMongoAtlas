var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
require('dotenv').config();


const MongoClient = require("mongodb").MongoClient;
const uri = process.MONGO_URI;
MongoClient.connect(uri, {useUnifiedTopology: true }, (err, client) => {
  // if (err) console.log("Error occurred connecting to MongoDB...");
  console.log("Connected to MongoDB!");
});
// const MongoStore = require('connect-mongo');
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
  uri: uri,
  collection: 'mySessions'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// app.use(session({
//   store: MongoStore.create({ mongoUrl: process.MONGO_URI })
// }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  contador: 0
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
