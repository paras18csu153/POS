const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

let tokenSchema = new mongoose.Schema({
  ownerId: { type: ObjectId, ref: "Owner" },
  userId: { type: ObjectId, ref: "User" }
});

module.exports = mongoose.model("Token", tokenSchema);