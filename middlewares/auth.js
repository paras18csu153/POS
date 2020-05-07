var mongoose = require('mongoose');
const Token = require("../models/token.model");

module.exports = async function(req, res, next) {
  var id=req.headers["authorization"];
  id=id.substring(14,id.length);
  var id = mongoose.Types.ObjectId(id);
  const tokenId = id;
  if (!tokenId) {
    // 401 : Unauthorized
    return res.status(401).send({ message: "No token provided" });
  }
  var token = await Token.findById(tokenId);
  if (!token) {
    // 403 : Forbidden
    return res.status(403).send({ message: "Invalid token" });
  }
  // set token in request for further use
  // this creates a new key called token and add's it to req json
  req.token = token;
  console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
  // make sure to call next
  next();
};