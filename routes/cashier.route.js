const express = require("express")
const router = express.Router()
const cashier_controller = require("../controllers/cashier.controller")
router.post("/viewBills", cashier_controller.viewBills)
router.post("/generateBill", cashier_controller.generateBill)
router.post("/modeofPayment", cashier_controller.modeofPayment)