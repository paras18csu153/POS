const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
let tableSchema = new mongoose.Schema({
tablenumber:Number,
tablestatus:String,
oid: { type: ObjectId, ref: "Owner" },
tableimage:String,
newtablenumber:Number,
newtablestatus:String
})

module.exports= mongoose.model('Table',tableSchema)