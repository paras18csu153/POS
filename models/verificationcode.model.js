const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
let verificationcodeSchema = new mongoose.Schema({
verifycode:Number,
owneRID: { type: ObjectId, ref: "Owner" },
employeeid:String,
})

module.exports= mongoose.model('Verificationcode',verificationcodeSchema)