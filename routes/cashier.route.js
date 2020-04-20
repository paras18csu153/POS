const express = require("express")
const router = express.Router()
const cashier_controller = require("../controllers/cashier.controller")
router.get("/Bills", cashier_controller.viewBills)
router.post("/Bill", cashier_controller.generateBill)
router.post("/Payment", cashier_controller.modeofPayment)
module.exports = router;
