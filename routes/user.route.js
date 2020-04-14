const express = require("express")
const router = express.Router()
const user_controller = require("../controllers/user.controller")
const user_auth = require("../middlewares/auth")
router.post("/signup", user_controller.signup)
router.post("/signin", user_controller.signin)
router.post("/signout", user_auth, user_controller.signout)
router.post("/forgotPassword", user_controller.fogotPassword)
module.exports = router