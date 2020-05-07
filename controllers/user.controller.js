const Token = require("../models/token.model")
const Owner = require("../models/owner.model")
const PasswordHash = require("password-hash")
const Verificationcode = require("../models/verificationcode.model")
const Employee = require("../models/employee.model")
const nodemailer = require('nodemailer');
exports.signin = async (req, res) => {
    //Sign in with existing account
    var user = await Owner.findOne({
        email: req.body.email
    })
    if (!user) {
        var user = await Employee.findOne({
            emailid: req.body.email
        })
        // 404 Not Found
        if (!user) {
            return res.status(404).send({
                message: "User doesn't exist!!"
            })
        }}

    // verify password
    if (!PasswordHash.verify(req.body.password, user.password)) {
        // 403 : Forbidden
        return res.status(403).send({
            message: "Incorrect password"
        })
    }

    // create new token
    var token = new Token({
        userId: user._id
    })

    // save token in database
    token = await token.save()
    if(user.verified==false){
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
        owneRID: user._id,
        verifycode: r
    })
    verificatcode = await verificatcode.save();
    console.log("Redirecting to verification page!!");
    var temp = user._id;
    async function myFunc(temp) {
        await Verificationcode.deleteOne({
            owneRID: user._id
        });
        console.log("Expired");
    }
    setTimeout(myFunc, 600000, temp);
    }

    res.header("authorization", token._id)
    res.status(200).send(user)
}
exports.signout = async (req, res) => {
    //Sign of the account
    var token = await Token.findByIdAndDelete (req.token._id);
  console.log (token);
  res.status (200).send ({msg: 'Signout success'});
}
exports.retrieveUser = async (req, res) => {
    //Send user associated with the userid
}
exports.fogotPassword = async (req, res) => {
    //Send user associated with the userid
}