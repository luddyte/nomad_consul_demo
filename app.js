var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var health = require('./routes/health');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// get db address from consul and make it available in the routers
// This will happen every time a route is invoked so it is not to be used
// in production...
app.use(function(req, res, next){
  const consul = require('consul')();
  var service_name = process.env.SERVICENAME ? process.env.SERVICENAME : 'mongodb';
  consul.catalog.service.nodes(service_name, function(err, result) {
    if (err) throw err; // container should be restarted automatically if this happens
    service_addr = result[0].ServiceAddress;
    service_port = result[0].ServicePort;
    console.log(`Consul returned addr ${service_addr} and port ${service_port}`);
    var mongo_conn_string = service_addr + ':' + service_port + '/demo'; // use demo db
    console.log(`conn_string: ${mongo_conn_string}`);
    db = require('monk')(mongo_conn_string);
    db.then(() => {
      db.create('timestamps');
      req.db = db;
      req.col = db.get('timestamps');
      next();
    })
  });
});

app.use('/', index);
app.use('/users', users);
app.use('/health', health);

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
