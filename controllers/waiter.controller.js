const Order = require("../models/order.model");
const Table = require("../models/table.model");
const Dish = require("../models/dish.model");
const Bill =require("../models/bill.model")

exports.viewTables = async (req, res) => {
  //Send the view of tables
  var tables = await Table.find()
  res.status(200).send(tables)
}
exports.updateStatus = async (req, res) => {
  //Update status of the table
}
exports.viewMenu = async (req, res) => {
  //Send the view of menu
  var dishes = await Dish.find()
  res.status(200).send(dishes)
}
exports.viewOrder = async (req, res) => {
  //Send the view of order
  var orders = await Order.find()
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
 var waiterid=req.token.waiterid;
  var order=await Order.findOne({
    tablenumber:req.body.tablenumber,
    waiterid:waiterid
  })
  if(order){
      return res.status(200).send({message:"Order exists"});
  }
  var dish=await Dish.findOne({
      dishname:req.body.dishname
  })
  var order = new Order({
    tablenumber:req.body.tablenumber,
    dishname: req.body.dishname,
    price: dish.price,
    waiterid:waiterid
  })
  order = await order.save() 
  res.status(200).send({ order })
}
exports.deleteOrder = async (req, res) => {
  //Update Order
  waiterid=req.token.waiterid;
  var order=await Order.findOne({
      tablenumber:req.body.tablenumber,
      waiterid:waiterid,
      dishname:req.body.dishname
  })
  if (!order) {
    res.status(404).send("Order  doesn't exist");
  }
  await Order.deleteOne(order._id); 
  res.status(200).send({ message: "Deleted" })
}
exports.generateBill = async (req, res) => {
    waiterid=req.token.waiterid;
    var orders=await Order.find({
        tablenumber:req.body.tablenumber,
        waiterid:waiterid
    })
    var bill= new Bill({
        waitid:waiterid,
        tabnumber:tablenumber,
    })
    await bill.save();
    res.status(200).send({orders});
}
exports.updateCustomerdetails = async (req, res) => {
  //Update Customer Details
}