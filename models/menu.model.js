const mongoose = require('mongoose')
    let menuSchema = new mongoose.Schema({
        DishName: {type:String, required:true},
        Category: {type: String, required: true},
        Price: {type: Number, required: true},
       
       })

module.exports = mongoose.model("menu",menuSchema)
