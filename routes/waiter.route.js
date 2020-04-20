const express = require("express")
const router = express.Router()
const waiter_controller = require("../controllers/waiter.controller")
router.get("/Tables", waiter_controller.viewTables)
router.post("/Status", waiter_controller.updateStatus)
router.get("/Menu", waiter_controller.viewMenu)
router.get("/Order", waiter_controller.viewOrder)
router.post("/Order", waiter_controller.takeOrder)
router.post("/Order", waiter_controller.updateOrder)
router.post("/OTP", waiter_controller.generateOTP)
router.post("/Customerdetails", waiter_controller.updateCustomerdetails)
module.exports = router;
