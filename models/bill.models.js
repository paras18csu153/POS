const mongoose = require('mongoose')
    let billSchema = new mongoose.Schema({
        SNO: {type: Number, required: true},
        Status: {type: String, required: true},
        total: {type:Number, required:true},
        TableNo: {type: Number, required: true},
        OrderNo: {type: String, required: true},
        CustomerPhoneNo: {type:Number, required:true},
        CustomerName: {type: String, required: true},
        ModeofPayment: {type: String, required: true},
        Totalamountpaid: {type: Number, required: true},
        Date: {type: Date, required: true},
        
    })

module.exports = mongoose.model("Bill",billSchema)
