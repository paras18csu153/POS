const Owner = require("../models/owner.model")
const Token = require("../models/token.model")
const Verificationcode = require("../models/verificationcode.model")
const Employee = require("../models/employee.model")
const PasswordHash = require("password-hash")
const nodemailer = require('nodemailer');
const Table = require("../models/table.model")
const Dish = require("../models/dish.model")
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
    if (req.token.userId != null) {
        console.log("userid:" + req.token.userId)
        ownerId = req.token.userId;
    } else {
        console.log("ownerid:" + req.token.ownerId)
        ownerId = req.token.ownerId;
    }
    var vercode = await Verificationcode.findOne({
        owneRID: ownerId
    });
    if (vercode.verifycode == req.body.verifycode) {
        await Verificationcode.deleteOne({
            verifycode: req.body.verifycode
        });
        await Owner.findByIdAndUpdate(ownerId, {
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    console.log(ownerId);
    var tables = await Table.find({
        oid: ownerId
    }, {
        tablenumber: 1,
        tableimage: 1,
        tablestatus: 1,
        _id: 0
    });
    console.log(tables)
    res.status(200).send({
        tables
    });
}
exports.addTable = async (req, res) => {
    //Add new table and send view of the tables 
    //Register the restaurant
    // First check if account exists with this email id
    var ti = "";
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid: ownerId
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
        oid: ownerId,
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid: ownerId
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var table = await Table.findOne({
        tablenumber: req.body.tablenumber,
        oid: ownerId
    });
    if (!table) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Table doesn't exist!"
        });
    }
    await Table.deleteOne({
        tablenumber: req.body.tablenumber,
        oid: ownerId
    });
    res.status(200).send({
        message: "Table deleted succesfully"
    });
}
exports.viewEmployees = async (req, res) => {
    //Send the view of employees
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var employees = await Employee.find({
        bossid: ownerId
    }, {
        employeename: 1,
        emailid: 1,
        phonenumber: 1,
        aadharnumber: 1,
        address: 1,
        type: 1,
        _id: 0
    });
    res.status(200).send({
        employees
    });
}
exports.addemployeemailid = async (req, res) => {
    //Send the view of employees
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var employee = await Employee.findOne({
        emailid: req.body.emailid,
        bossid: ownerId
    });
    if (employee) {
        return res.status(409).send({
            message: "Employee already exists"
        });
    }
    var employee = await Owner.findOne({
        emailid: req.body.emailid
    });
    if (employee) {
        return res.status(409).send({
            message: "The owner cannot be an Employee."
        });
    }
    var boss = await Owner.findOne({
        _id: ownerId
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
        owneRID: ownerId,
        verifycode: r
    })
    verificatcode = await verificatcode.save();
    var temp = ownerId;
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var code = await Verificationcode.findOne({
        owneRID: ownerId,
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
            bossid: ownerId,
            emailid: code.employeeid,
            verifiedid: true
        });
        employee = await employee.save();
        await Verificationcode.deleteOne({
            verifycode: req.body.verifycode,
            bossid: ownerId
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    //Add employee to the database
    var employee = await Employee.findOne({
        bossid: ownerId,
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var employee = await Employee.findOne({
        emailid: req.body.emailid,
        bossid: ownerId
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
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var employee = await Employee.findOne({
        emailid: req.body.emailid,
        bossid: ownerId
    });
    if (!employee) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Employee doesn't exist!"
        });
    }
    await Employee.deleteOne({
        emailid: req.body.emailid,
        bossid: ownerId
    });
    res.status(200).send({
        message: "Employee deleted succesfully"
    });
}
exports.viewDishes = async (req, res) => {
    //Send the view of menu
    console.log("..........................." + req.token.userId)
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var dishes = await Dish.find({
        dishid: ownerId
    }, {
        dishimage: 1,
        dishname: 1,
        veg: 1,
        category: 1,
        price: 1,
        _id: 0
    });
    console.log(dishes)
    res.status(200).send({
        dishes
    });
}
exports.addDish = async (req, res) => {
    //Add dish to the database
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var dish = await Dish.findOne({
        dishid: ownerId,
        dishname: req.body.dishname
    })
    if (dish) {
        // 409 : Conflict
        return res.status(409).send({
            message: "Dish already exists"
        });
    }
    var dish = new Dish({
        dishid: ownerId,
        dishname: req.body.dishname,
        dishimage: req.body.dishimage,
        price: req.body.price,
        category: req.body.category,
        vegnonveg: req.body.vegnonveg
    });
    dish = await dish.save();
    res.status(200).send({
        message: "Dish added succesfully"
    });
}
exports.updateDish = async (req, res) => {
    //Update menu and delete dish
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var dish = await Dish.findOne({
        dishname: req.body.dishname,
        dishid: ownerId
    });
    if (!dish) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Dish doesn't exist!"
        });
    }
    if(req.body.newdishname==""){
        req.body.newdishname=dish.dishname;
    }
    if(req.body.newprice==0){
        req.body.newprice=dish.price
    }
    if(req.body.newcategory=="none"){
        req.body.newcategory=dish.category
    }
    if(req.body.newvegnonveg=="none"){
        req.body.newvegnonveg=dish.vegnonveg;
    }
    await Dish.findByIdAndUpdate(dish._id, {
        "$set": {
            "dishid": ownerId,
            "dishname": req.body.newdishname,
            "dishimage": req.body.newdishimage,
            "price": req.body.newprice,
            "category": req.body.newcategory,
            "vegnonveg": req.body.newvegnonveg
        }
    });
    res.status(200).send({
        message: "Table updated succesfully"
    });
}
exports.deleteDish = async (req, res) => {
    //Update menu and delete dish
    if (req.token.userId != null) {
        ownerId = req.token.userId;
    } else {
        ownerId = req.token.ownerId;
    }
    var dish = await Dish.findOne({
        dishname: req.body.dishname,
        dishid: ownerId
    });
    if (!dish) {
        // 409 : Conflict
        return res.status(453).send({
            message: "Dish doesn't exist!"
        });
    }
    await Dish.deleteOne({
        dishname: req.body.dishname,
        dishid: ownerId
    });
    res.status(200).send({
        message: "Table deleted succesfully"
    });
}