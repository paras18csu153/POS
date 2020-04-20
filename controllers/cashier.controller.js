const viewBills = require('../models/view.models')
const table = require('../models/table.model')



exports.viewBills = async (req, res) => {
    var bill = await viewBills.find()
    res.status(200).send(viewBills)
    //View bills
}
exports.generateBill = async (req, res) => {
    //Generate bills
}
exports.closeTable = async (req, res) => {
    exports.closeTable = async function (req, res) {
        var Table = table.findByIdAndDelete(req.params.string)
        if (!table) {
            res.status(404).send(`bill with id ${req.params.id} doesn't exist`)
        }
    
        res.status(200).send({ message: "closed" })
    }
    
    
}
exports.modeofPayment = async (req, res) => {
    //Send the mode of payment with the order id
}
