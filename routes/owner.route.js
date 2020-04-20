const express = require("express")
const router = express.Router()
const owner_controller = require("../controllers/owner.controller")
const auth = require("../middlewares/auth");
router.post("/signup", owner_controller.signup)
router.post("/verifymail",auth, owner_controller.verifymail)
router.post("/addTable",auth, owner_controller.addTable)
router.post("/updatetable",auth, owner_controller.updateTable)
router.delete("/table",auth, owner_controller.deleteTable)
router.get("/viewTables",auth, owner_controller.viewTables)
router.post("/addemployeemailid",auth, owner_controller.addemployeemailid)
router.post("/verifyemployeemailid",auth, owner_controller.verifyemployeemailid)
router.post("/addEmployee",auth,owner_controller.addEmployee)
router.post("/updateEmployee",auth,owner_controller.updateEmployee)
router.post("/deleteEmployee",auth,owner_controller.deleteEmployee)
router.get("/viewEmployees",auth, owner_controller.viewEmployees)
router.post("/addDish", owner_controller.addDish)
router.post("/updateDish", owner_controller.updateDish)
router.get("/viewDishes", owner_controller.viewDishes)
router.post("/deleteDish", owner_controller.deleteDish)

router.get("/viewOrders", owner_controller.viewOrders)
router.get("/viewBills", owner_controller.viewBills)
module.exports = router