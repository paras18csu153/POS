const Token = require("../models/tokern.dmodel")
const PasswordHash = require("password-hash")
exports.signup = async (req, res) => {
    //Register the restaurant
}
exports.signin = async (req, res) => {
    // First check if account exists with this email id
  var user = await User.findOne({ email: req.body.email })
  if (!user) {
    // 404 Not Found
    return res.status(404).send({ message: "Account does not exists" })
  }

  // verify password
  if (!PasswordHash.verify(req.body.password, user.password)) {
    // 403 : Forbidden
    return res.status(403).send({ message: "Invalid password" })
  }

  // create new token
  var token = new Token({ userId: user._id })

  // save token in database
  token = await token.save()

  res.header("authorization", token._id)
  res.status(200).send(user)
}
exports.signout = async (req, res) => {
    // Remove token from database
    var token = await Token.findByIdAndDelete(req.token._id)
    console.log(token)
    res.status(200).send({ message: "Signout success" })
}
exports.retrieveUser = async (req, res) => {
    //Send user associated with the userid
}
exports.fogotPassword = async (req, res) => {
    //Send user associated with the userid
}