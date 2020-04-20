const mongoose = require('mongoose')
var Schema = mongoose.Schema
let ownerSchema = new mongoose.Schema({
restaurantname: {type:String,reqiured:true},
email: {type:String,reqiured:true},
location:{type:String,reqiured:true},
password: {type:String,reqiured:true},
confirmpassword: {type:String,reqiured:true},
type:{type:String},
verified:{type:Boolean}
})

module.exports= mongoose.model('Owner',ownerSchema)