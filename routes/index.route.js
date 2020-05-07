const express = require("express")
const router = express.Router()
const index_controller = require("../controllers/index.controller")

router.get("/", index_controller.homePage)
router.get("/Ownerdashboard",index_controller.Ownerdashboard)
router.get("/signup", index_controller.signupPage)
router.get("/verificationpage", index_controller.verificationPage)
router.get("/Tables",index_controller.ownerviewtables)
router.get("/addtable",index_controller.addtable)
router.get("/updatetable",index_controller.updatetable)
router.get("/deletetable",index_controller.deletetable)
router.get("/Employees",index_controller.employees)
router.get("/addemployee",index_controller.addemployee)
router.get("/verificationpageemployee", index_controller.verificationPageemployee)
router.get("/addemployeedetails",index_controller.addemployeedetails)
router.get("/updateemployee",index_controller.updateemployee)
router.get("/deleteemployee",index_controller.deleteemployee)
router.get("/viewdishes",index_controller.viewdishes)
router.get("/adddish",index_controller.adddish)
router.get("/updatedish",index_controller.updatedish)
router.get("/deletedish",index_controller.deletedish)
module.exports = router;