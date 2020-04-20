const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
let dishSchema = new mongoose.Schema({
dishid: { type: ObjectId, ref: "Owner" },
dishname:String,
vegnonveg:Boolean,
category:String
})

module.exports= mongoose.model('Dish',dishSchema)