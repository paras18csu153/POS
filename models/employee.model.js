const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
let employeeSchema = new mongoose.Schema({
employeename:String,
emailid:{type:String,required:true},
bossid: { type: ObjectId, ref: "Owner" },
phonenumber:Number,
aadharnumber:Number,
address:String,
type:String,
verifiedid:Boolean,
newemployeename:String,
newphonenumber:Number,
newaadharnumber:Number,
newaddress:String,
newtype:String
})

module.exports= mongoose.model('Employee',employeeSchema)