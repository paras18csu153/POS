const Owner = require("../models/owner.model")
const Token = require("../models/token.model")
const Verificationcode = require("../models/verificationcode.model")
const Employee = require("../models/employee.model")
const PasswordHash = require("password-hash")
const nodemailer = require('nodemailer');
const Table = require("../models/table.model")
const Dish=require("../models/dish.model")
exports.signup = async (req, res) => {
    if (req.body.password !== req.body.confirmpassword) {
        //415 : Conflict
        return res.status(415).send({
            message: "Both passwords do not match"
        });
    }
    //Register the restaurant
    // First check if account exists with this email id
    var owner = await Owner.findOne({
        email: req.body.email
    });
    if (owner) {
        // 409 : Conflict
        return res.status(409).send({
            message: "Owner already exists"
        });
    }
    // Create a new owner with the data client has sent
    // Make sure to hash the password
    owner = new Owner({
        restaurantname: req.body.restaurantname,
        email: req.body.email,
        password: PasswordHash.generate(req.body.password),
        location: req.body.location,
        type: "Owner",
        verified: false,
    });

    // save user in database
    owner = await owner.save();
    // create new token
    var token = new Token({
        ownerId: owner._id
    });

    // save token in database
    token = await token.save();
    res.header("authorization", token._id);
    res.status(200).send({
        message: "Account created successfully"
    });
    var r = Math.floor(100000 + Math.random() * 900000);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cuisinevotre24@gmail.com',
            pass: 'vcadmin@12345'
        }
    });

    var mailOptions = {
        from: 'cuisinevotre24@gmail.com',
        to: req.body.email,
        subject: 'Votre Cuisine-Verification Mail',
        html: '<h2>Hi, The Owner of ' + req.body.restaurantname + '</h2><p>Your Verification code for Votre Cuisine is:</p><h3>' + r + '</h3><p>And is valid for only 10 minutes.',
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    var verificatcode = new Verificationcode({
        owneRID: owner._id,
        verifycode: r
    })
    verificatcode = await verificatcode.save();
    console.log("Redirecting to verification page!!");
    var temp = owner._id;
    async function myFunc(temp) {
        await Verificationcode.deleteOne({
            owneRID: owner._id
        });
        console.log("Expired");
    }
    setTimeout(myFunc, 600000, temp);
}
exports.verifymail = async (req, res) => {
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var vercode = await Verificationcode.findOne({
        owneRID: req.token.ownerId
    });
    if (vercode.verifycode === req.body.verifycode) {
        await Verificationcode.deleteOne({
            verifycode: vercode.verifycode
        });
        await Owner.findByIdAndUpdate(token.ownerId, {
            "$set": {
                "verified": true
            }
        });
        console.log("Verified");
        res.status(200).send({
            message: "Moving to dashboard"
        });
    }
}
exports.viewTables = async (req, res) => {
    //Send the view of tables
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var tables = await Table.find({
        oid: token.ownerId
    }, {
        tablenumber: 1,
        tablestatus: 1,
        tableimage: 1,
        _id: 0
    });
    res.status(200).send({
        tables
    });
}
exports.addTable = async (req, res) => {
    //Add new table and send view of the tables 
    //Register the restaurant
    // First check if account exists with this email id
    var ti = "";
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid: token.ownerId
    });
    if (table) {
        // 409 : Conflict
        return res.status(409).send({
            message: "Table already exists"
        });
    }
    if (req.body.tablestatus === "Vacant") {
        var t = await Table.findOne({
            checkstatus: "Vacant"
        });
    } else if (req.body.tablestatus === "Billing") {
        var t = await Table.findOne({
            checkstatus: "Billing"
        });
    } else if (req.body.tablestatus === "Reserved") {
        var t = await Table.findOne({
            checkstatus: "Reserved"
        });
    } else {
        var t = await Table.findOne({
            checkstatus: "Occupied"
        });;
    }
    ti = t.tableimage;
    // Create a new owner with the data client has sent
    // Make sure to hash the password
    var table = new Table({
        oid: token.ownerId,
        tablenumber: req.body.tablenumber,
        tablestatus: req.body.tablestatus,
        tableimage: ti
    });

    // save user in database
    table = await table.save();
    res.status(200).send({
        message: "Table added succesfully"
    });
}
exports.updateTable = async (req, res) => {
    //Update table number and delete table
    var ti = "";
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid: token.ownerId
    });
    if (!table) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Table doesn't exist!"
        });
    }

    tablenumber = req.body.newtablenumber;
    tablestatus = req.body.newtablestatus;
    if (req.body.newtablestatus === "Vacant") {
        var t = await Table.findOne({
            checkstatus: "Vacant"
        });
    } else if (req.body.newtablestatus === "Billing") {
        var t = await Table.findOne({
            checkstatus: "Billing"
        });
    } else if (req.body.newtablestatus === "Reserved") {
        var t = await Table.findOne({
            checkstatus: "Reserved"
        });
    } else {
        var t = await Table.findOne({
            checkstatus: "Occupied"
        });
    }
    ti = t.tableimage;
    await Table.findByIdAndUpdate(table._id, {
        "$set": {
            "tablenumber": tablenumber,
            "tablestatus": tablestatus,
            "tableimage": ti
        }
    });
    res.status(200).send({
        message: "Table updated succesfully"
    });
}
exports.deleteTable = async (req, res) => {
    //Send the view of employees

    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid:token.ownerId
    });
    if (!table) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Table doesn't exist!"
        });
    }
    await Table.deleteOne({
        tablenumber: req.body.tablenumber,
        oid:token.ownerId
    });
    res.status(200).send({
        message: "Table deleted succesfully"
    });
}
exports.viewEmployees = async (req, res) => {
    //Send the view of employees
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var employees = await Employee.find({
        bossid: token.ownerId
    }, {
        employeename:1,
        emailid:1,
        bossid:0,
        phonenumber:1,
        aadharnumber:1,
        address:1,
        type:S1,
        verifiedid:0,
        _id: 0
    });
    res.status(200).send({
        employees
    });
}
exports.addemployeemailid = async (req, res) => {
    //Send the view of employees
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var employee = await Employee.findOne({
        emailid: req.body.emailid,
        bossid:token.ownerId
    });
    if (employee) {
        return res.status(409).send({
            message: "Employee already exists"
        });
    }
    var boss = await Owner.findOne({
        _id: token.ownerId
    });
    var r = Math.floor(100000 + Math.random() * 900000);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cuisinevotre24@gmail.com',
            pass: 'vcadmin@12345'
        }
    });
    var mailOptions = {
        from: 'cuisinevotre24@gmail.com',
        to: req.body.emailid,
        subject: 'Votre Cuisine-Verification Mail',
        html: '<h2>Hi, The Owner of ' + boss.restaurantname + ' invited you to Votre Cuisine.</h2><p>Your Verification code for Votre Cuisine is:</p><h3>' + r + '</h3><p>And is valid for only 10 minutes.',
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    var verificatcode = new Verificationcode({
        employeeid: req.body.emailid,
        owneRID: token.ownerId,
        verifycode: r
    })
    verificatcode = await verificatcode.save();
    var temp = token.ownerId;
    async function myFunc(temp) {
        await Verificationcode.deleteOne({
            owneRID: temp
        });
        console.log("Expired");
    }
    setTimeout(myFunc, 600000, temp);
    console.log("Redirecting to verification hello page!!");
    res.status(200).send({
        message: "Redirecting to verification page!!"
    });
}
exports.verifyemployeemailid = async (req, res) => {
    //Add employee to the database
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var code = await Verificationcode.findOne({
        owneRID: token.ownerId,
        verifycode: req.body.verifycode
    });
    if (code) {
        var employee = await Employee.findOne({
            emailid: req.body.emailid
        });
        if (employee) {
            // 409 : Conflict
            return res.status(409).send({
                message: "Employee already exists"
            });
        }
        var employee = new Employee({
            bossid: token.ownerId,
            emailid: code.employeeid,
            verifiedid: true
        });
        employee = await employee.save();
        await Verificationcode.deleteOne({
            verifycode: req.body.verifycode,
            bossid:token.ownerId
        });
        res.status(200).send({
            message: "Employee added succesfully"
        });
    } else {
        res.status(513).send({
            message: "Invalid verification code!"
        });
    }
}
exports.addEmployee = async (req, res) => {
    //Add employee to the database

    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var employee = await Employee.findOne({
        bossid: token.ownerId,
        verifiedid: true
    });
    if (!employee) {
        return res.status(409).send({
            message: "Employee doesn't exist"
        });
    }
    await Employee.findByIdAndUpdate(employee._id, {
        "$set": {
            "employeename": req.body.employeename,
            "phonenumber": req.body.phonenumber,
            "aadharnumber": req.body.aadharnumber,
            "address": req.body.address,
            "type": req.body.type
        }
    });
    res.status(200).send({
        message: "Employee added succesfully"
    });
}
exports.updateEmployee = async (req, res) => {
    //Update and delete employee
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var employee = await Employee.findOne({
        emailid:req.body.emailid,
        bossid:token.ownerId
    });
    if (!employee) {
        return res.status(453).send({
            message: "Employee doesn't exist!"
        });
    }
    await Employee.findByIdAndUpdate(employee._id, {
        "$set": {
            "employeename": req.body.newemployeename,
            "phonenumber": req.body.newphonenumber,
            "aadharnumber": req.body.newaadharnumber,
            "address": req.body.newaddress,
            "type": req.body.newtype
        }
    });
    res.status(200).send({
        message: "Employee added succesfully"
    });
}
exports.deleteEmployee = async (req, res) => {
    //Send the view of menu
    var token = await Token.findOne({
        ownerId: req.token.ownerId
    });
    var employee = await Employee.findOne({
        emailid:req.body.emailid,
        bossid:token.ownerId
    });
    if (!employee) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Employee doesn't exist!"
        });
    }
    await Employee.deleteOne({
        emailid:req.body.emailid,
        bossid:token.ownerId
    });
    res.status(200).send({
        message: "Employee deleted succesfully"
    });
}
exports.viewDishes = async (req, res) => {
    //Send the view of menu
}
exports.addDish = async (req, res) => {
    //Add dish to the database
    var dish=new Dish({
        price:800.00
    });
    console.log(dish.price);
}
exports.updateDish = async (req, res) => {
    //Update menu and delete dish
}
exports.deleteDish = async (req, res) => {
    //Update menu and delete dish
}
exports.viewOrders = async (req, res) => {
    //View orders
}
exports.viewBills = async (req, res) => {
    //View bills
}