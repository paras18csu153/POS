const mongoose = require('mongoose')
var Schema = mongoose.Schema

    let orderSchema = new mongoose.Schema({
        OrderNo: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        DishName: {type:String, required:true},
        Category: {type: String, required: true},
        Price: {type: Number, required: true},
       })

module.exports = mongoose.model("order",orderSchema)