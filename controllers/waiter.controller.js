const Order = require("../models/order.model");
const table = require("../models/table.model");
const menu = require("../models/menu.model");
const waiter =require("../models/waiter.model")

exports.viewTables = async (req, res) => {
  //Send the view of tables
  var tables = await table.find()
  res.status(200).send(tables)
}
exports.updateStatus = async (req, res) => {
  //Update status of the table
}
exports.viewMenu = async (req, res) => {
  //Send the view of menu
  var menus = await menu.find()
  res.status(200).send(menus)
}
exports.viewOrder = async (req, res) => {
  //Send the view of order
  var orders = await order.find()
  res.status(200).send(orders)
}
// exports.takeOrder = async (req, res) => {
//   //Take order
//   var order = new Order(req.body);
//   var dish = await dish.find();
//   dish = await dish.save(); 
//   order = await order.save();
//   res.status(200).send(order)
// }

exports.takeOrder = async (req, res) => {
  //Take order
  var order = new Order({
    orderNo: req.body.orderNoId,
    dishname: req.body.dishname,
    category: req.body.category,
    price: req.body.price,
  })

  order = await order.save()

  await waiter.findByIdAndUpdate(req.token.order, {
    "$push": {
      "orders": order._id
    }
  }, { "new": true, "upsert": true })
  res.status(200).send({ message: "orders" })

  
}
exports.updateOrder = async (req, res) => {
  //Update Order
  let order = await Order.findByIdAndUpdate(req.params.id, { dish: req.body.dish })
  if (!order) {
    res.status(404).send(`Order with id ${req.params.id} doesn't exist`)
  }

  res.status(200).send({ message: "Updated" })
  res.send()
}
exports.generateOTP = async (req, res) => {
  //Generate OTP
}
exports.generateBill = async (req, res) => {

}
exports.updateCustomerdetails = async (req, res) => {
  //Update Customer Details
}