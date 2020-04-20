const express = require("express")
const router = express.Router()
const waiter_controller = require("../controllers/waiter.controller")
router.get("/tables", waiter_controller.viewTables)
router.post("/status", waiter_controller.updateStatus)// extra feature
router.get("/menu", waiter_controller.viewMenu)
router.get("/order", waiter_controller.viewOrder)
router.post("/order", waiter_controller.takeOrder)
router.put("/order", waiter_controller.updateOrder)
router.post("/otp", waiter_controller.generateOTP)// extra feature
router.post("/bill", waiter_controller.generateBill)
//router.post("/Customer", waiter_controller.updateCustomerdetails)//extra feature
module.exports = router;