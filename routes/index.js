var express = require('express');
var router = express.Router();
// const waiter_controller = require("../controllers/waiter.controller")
// const waiter_dashboard = require("..views/waiterdashboard")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/waiter",function (req, res) {
  res.render('waiterdashboard');
});
router.get("/cashier",function (req, res) {
  res.render('cashierdashboard');
});
router.get("/waiter/tables",function (req, res) {
  res.render('selectable');
});
router.get("/cashier/Bill",function (req, res) {
  res.render('bill');
});
router.get("/waiter/menu",function (req, res) {
  res.render('takeorder');
});

module.exports = router;
