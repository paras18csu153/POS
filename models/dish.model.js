const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
let dishSchema = new mongoose.Schema({
dishid: { type: ObjectId, ref: "Owner" },
dishimage: String,
dishname:String,
vegnonveg:String,
category:String,
price:Number
})

module.exports= mongoose.model('Dish',dishSchema)