
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require("mssql");
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.sendFile(path.join(__dirname, 'public/index.html'))
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


//Base de datos

  // config for your database
  /*var config = {
    user: 'SA',
    password: 'victorniko97V',
    server: '35.197.27.210',
    database: 'MRP',
    options: { encrypt: true, database: 'MRP' }
  };

  // connect to your database
  sql.connect(config, function (err) {

    console.log("Se conecto a la base de datos");
  });*/

  var sworm = require('sworm');
  var models = require("./models");

 var db = sworm.db({
   driver: 'mssql',
   config: {
    user: 'SA',
    password: 'victorniko97V',
    server: '35.197.27.210',
    database: 'MRP',
    options: { encrypt: true, database: 'MRP' }
   }
 });

 db.connect().then(()=>{
   console.log("Conectado!");
   models.load(db);
 })

 