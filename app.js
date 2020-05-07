var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose")
var url = "mongodb+srv://Paras:password12345@test-55ahv.mongodb.net/test?retryWrites=true&w=majority";
mongoose.Promise = global.Promise
// Connecting to the database
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to the database")
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err)
    process.exit()
  })

var indexRouter = require('./routes/index.route');
var userRouter = require('./routes/user.route');
var ownerRouter=require('./routes/owner.route');
var waiterRouter = require('./routes/waiter.route');
var cashierRouter = require('./routes/cashier.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/owner', ownerRouter);
app.use('/waiter', waiterRouter);
app.use('/waiter/tables', waiterRouter);
app.use('/waiter/order', waiterRouter);
app.use('/waiter/bill', waiterRouter);
app.use('/waiter/menu', waiterRouter);
app.use('/cashier/bill', cashierRouter);
app.use('/cashier/:id', cashierRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
