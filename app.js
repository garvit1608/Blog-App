require('use-strict');
GLOBAL.pry = require('pryjs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var config = require('./config/config');
var passport = require('passport');
var  LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

mongoose.connect(config.database);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// serialize user
passport.serializeUser(function(user, done) {

    done(null, user.id);
});
// deserialize user
passport.deserializeUser(function(id, done) {

    User.findById({ _id: id }, function(err, user) {
        done(err, user);
    });
});

// passport local strategy
passport.use(new LocalStrategy({
      usernameField: 'name',
      passwordField: 'password'
  },
  function(name, password, done) {
    User.findOne({ name: name }, function (err, user) {

      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: "Name is not correct" });
      }
      if(!user.admin) {
        return done(null, false, { message: "User is not admin" });
      }

      user.validPassword(password, function(err, data) {
        if(err) return done(err);

        if(!data){
          return done(null, false, { message: "password is not correct"} );
        }

        return done(null, user);
      });
    });
  }
));

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
  }), function(req, res) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
    res.redirect('/admin/blogs');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
