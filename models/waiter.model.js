const mongoose = require('mongoose')
var Schema = mongoose.Schema
let waiterSchema = new mongoose.Schema({
name: {type:String,reqiured:true},
email: {type:String,reqiured:true},
password: {type:String,reqiured:true},
orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }]
})

module.exports= mongoose.model('waiter',waiterSchema)